import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import DataElementWrapper from '../DataElementWrapper';
import Icon from 'components/Icon';
import TextEditingPanel from './TextEditingPanel';
import DataElements from 'constants/dataElement';
import useDidUpdate from 'hooks/useDidUpdate';
import { isMobileSize } from 'helpers/getDeviceSize';

const fonts = [];

const TextEditingPanelContainer = () => {
  const [isOpen, isDisabled, textEditingPanelWidth, isInDesktopOnlyMode] = useSelector(
    (state) => [
      selectors.isElementOpen(state, 'textEditingPanel'),
      selectors.isElementDisabled(state, 'textEditingPanel'),
      selectors.getTextEditingPanelWidth(state),
      selectors.isInDesktopOnlyMode(state),
    ],
    shallowEqual,
  );

  const isMobile = isMobileSize();

  // selection modes used are 'FreeText' and 'ContentBox'
  const [selectionMode, setSelectionMode] = useState(null);

  useDidUpdate(() => {
    const supportedFonts = window.Core.ContentEdit.getContentEditingFonts();

    supportedFonts.then((res) => res.forEach((font) => {
      if (!fonts.includes(font)) {
        fonts.push(font);
      }
    }));
  }, [selectionMode]);

  const annotationRef = useRef(null);
  const contentEditorRef = useRef(null);

  const [selectedContentBox, setSelectedContentBox] = useState(null);

  // properties for TextStylePicker
  const [textEditProperties, setTextEditProperties] = useState({});

  // properties for custom buttons and color picker
  const [format, setFormat] = useState({});

  useEffect(() => {
    const handleSelectionChange = async () => {
      if (contentEditorRef.current && core.getContentEditManager().isInContentEditMode()) {
        const attribute = await contentEditorRef.current.getTextAttributes();

        setFormat((format) => {
          return {
            ...format,
            ...attribute
          };
        });

        const fontObject = {
          FontSize: attribute.fontSize,
          Font: getFontName(attribute.fontName),
        };

        if (!fonts.includes(fontObject.Font)) {
          fonts.push(fontObject.Font);
        }

        setTextEditProperties(fontObject);

        window.Core.ContentEdit.setTextAttributes(attribute);
      }
    };
    core.addEventListener('contentEditSelectionChange', handleSelectionChange);
    return () => core.removeEventListener('contentEditSelectionChange', handleSelectionChange);
  }, []);

  /**
   * @ignore
   * Small routine that strips out the bold and italic from the font name, separates the Font into separate words for the UI
   * @param {string} fontString
   * @returns {string} the separated font name
   */
  function getFontName(fontString) {
    const cleanedFontString = fontString.replace(/(Bold|Italic)/gi, '').trim();
    const words = [];
    let currentWord = '';

    for (const char of cleanedFontString) {
      if (char.toUpperCase() === char) {
        if (currentWord) {
          words.push(currentWord.trim());
        }
        currentWord = char;
      } else {
        currentWord += char;
      }
    }

    if (currentWord) {
      words.push(currentWord.trim());
    }

    const separatedFontName = words.join(' ');

    return separatedFontName;
  }

  useEffect(() => {
    const handleEditorStarted = ({ editor }) => {
      contentEditorRef.current = editor;
      dispatch(actions.setContentBoxEditor(contentEditorRef.current));
    };
    core.addEventListener('contentBoxEditStarted', handleEditorStarted);
    return () => core.removeEventListener('contentBoxEditStarted', handleEditorStarted);
  }, []);

  useEffect(() => {
    const handleEditorEnd = () => {
      if (core.getContentEditManager().isInContentEditMode()) {
        contentEditorRef.current = null;
        dispatch(actions.setContentBoxEditor(null));
      }
    };

    core.addEventListener('contentBoxEditEnded', handleEditorEnd);
    return () => core.removeEventListener('contentBoxEditEnded', handleEditorEnd);
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    const handleContentEditModeStart = () => {
      // start with panel closed in mobile so it doesn't cover the whole screen
      if (!isInDesktopOnlyMode && isMobile) {
        return;
      }
      dispatch(actions.closeElements(['searchPanel', 'notesPanel', 'redactionPanel', 'wv3dPropertiesPanel']));
      dispatch(actions.openElement('textEditingPanel'));
    };

    const handleContentEditModeEnd = () => {
      dispatch(actions.closeElement('textEditingPanel'));
    };

    core.addEventListener('contentEditModeStarted', handleContentEditModeStart);
    core.addEventListener('contentEditModeEnded', handleContentEditModeEnd);
    return () => {
      core.removeEventListener('contentEditModeStarted', handleContentEditModeStart);
      core.removeEventListener('contentEditModeEnded', handleContentEditModeEnd);
    };
  }, []);

  useEffect(() => {
    const handleAnnotationSelected = (annotations, action) => {
      if (!core.getContentEditManager().isInContentEditMode()) {
        return;
      }
      const annotation = annotations[0];
      const isFreeText =
        annotation instanceof window.Core.Annotations.FreeTextAnnotation &&
        annotation.getIntent() === window.Core.Annotations.FreeTextAnnotation.Intent.FreeText &&
        (annotation.getContentEditAnnotationId() || annotation.ToolName === window.Core.Tools.ToolNames.ADD_PARAGRAPH);
      if (action === 'selected') {
        if (!isInDesktopOnlyMode && isMobile) {
          return;
        }
        if (isFreeText) {
          annotationRef.current = annotation;
          setSelectionMode('FreeText');
          if (!isDisabled && !isOpen) {
            dispatch(actions.toggleElement('textEditingPanel'));
          }
        } else if (annotation.isContentEditPlaceholder()) {
          setSelectedContentBox(annotation);
          setFormat(getDefaultFormat(annotation));
          setTextEditProperties(getTextEditPropertiesFromContentEditPlaceHolder(annotation));
          setSelectionMode('ContentBox');
          annotationRef.current = null;
          if (!isDisabled && !isOpen) {
            dispatch(actions.toggleElement('textEditingPanel'));
          }
        }
      } else if (action === 'deselected') {
        if (selectedContentBox !== undefined) {
          setSelectedContentBox(null);
          if (!annotationRef.current) {
            setSelectionMode(null);
          }
        }
      }
    };

    core.addEventListener('annotationSelected', handleAnnotationSelected);
    return () => {
      core.removeEventListener('annotationSelected', handleAnnotationSelected);
    };
  }, [isDisabled, isOpen]);

  useEffect(() => {
    const onResize = () => {
      if (core.getContentEditManager().isInContentEditMode()) {
        if (isMobile) {
          dispatch(actions.closeElement('textEditingPanel'));
        } else {
          dispatch(actions.openElement('textEditingPanel'));
        }
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handlePropertyChange = (property, value) => {
    if (annotationRef.current) {
      core.setAnnotationStyles(annotationRef.current, {
        [property]: value,
      });
    } else {
      setTextEditProperties({
        ...textEditProperties,
        [property]: value,
      });
    }

    if (selectedContentBox) {
      switch (property) {
        case 'Font':
          window.Core.ContentEdit.setContentFont(selectedContentBox, value);
          break;
        case 'FontSize':
          window.Core.ContentEdit.setContentFontSize(selectedContentBox, value);
          break;
        case 'TextAlign':
          window.Core.ContentEdit.alignContents(selectedContentBox, value);
          break;
      }
    }

    const conversionMap = {
      Font: 'fontName',
      FontSize: 'fontSize',
      TextAlign: 'textAlign',
    };

    window.Core.ContentEdit.setTextAttributes({ [conversionMap[property]]: value });
  };

  const getDefaultFormat = (annotation) => {
    const { color } = annotation.getContentEditingFormat();
    const defaultColor = color || '#000000';
    return {
      bold: false,
      italic: false,
      underline: false,
      color: defaultColor
    };
  };

  const handleRichTextStyleChange = (property, value) => {
    if (annotationRef.current) {
      core.updateAnnotationRichTextStyle(annotationRef.current, { [property]: value });
    } else {
      setTextEditProperties({
        ...textEditProperties,
        [property]: value,
      });
    }
  };

  const handleTextFormatChange = (updatedDecorator) => () => {
    if (selectedContentBox) {
      switch (updatedDecorator) {
        case 'bold':
          window.Core.ContentEdit.toggleBoldContents(selectedContentBox);
          break;
        case 'italic':
          window.Core.ContentEdit.toggleItalicContents(selectedContentBox);
          break;
        case 'underline':
          window.Core.ContentEdit.toggleUnderlineContents(selectedContentBox);
          break;
      }

      setFormat((format) => ({
        ...format,
        [updatedDecorator]: !format[updatedDecorator]
      }));
    }
  };

  const handleAddLinkToText = async () => {
    if (contentEditorRef.current) {
      await contentEditorRef.current.loadHyperLinkURL();
      dispatch(actions.openElement(DataElements.CONTENT_EDIT_LINK_MODAL));
    }
  };

  const handleColorChange = (_, color) => {
    const textColor = color.toHexString();
    if (selectedContentBox) {
      window.Core.ContentEdit.setTextColor(selectedContentBox, textColor);
    }
    applyFormat('color', color);
  };

  const applyFormat = (formatKey, value) => {
    if (formatKey === 'color') {
      value = new window.Core.Annotations.Color(value);
    }

    // format the entire editor doesn't trigger the editorTextChanged event, so we set the format state here
    setFormat({
      ...format,
      [formatKey]: value,
    });
  };

  const getTextEditPropertiesFromContentEditPlaceHolder = (annotation) => {
    const fontMap = {};

    fonts.forEach((font) => {
      const fontKey = font.replace(/\s+/g, '');
      fontMap[fontKey] = font;
    });

    const isTextContentPlaceholder = annotation.isContentEditPlaceholder() && annotation.getContentEditType() === window.Core.ContentEdit.Types.TEXT;
    if (isTextContentPlaceholder) {
      const styleProperties = annotation.getContentStyleProperties();
      if (!styleProperties) {
        return;
      }
      const { fontSize, fontFamily, textAlign } = styleProperties;
      let fontName = fontMap[fontFamily.replace(/\s+/g, '')];

      // hack to use placeholder in font dropdown needs to have a non-empty, not included value
      if (!fontName) {
        fontName = 'Font';
      }

      return {
        Font: fontName,
        FontSize: fontSize,
        TextAlign: textAlign,
      };
    }
  };

  const handleUndo = async () => {
    await core.getDocumentViewer().getContentEditHistoryManager().undo();
  };

  const handleRedo = async () => {
    await core.getDocumentViewer().getContentEditHistoryManager().redo();
  };

  const undoRedoProperties = {
    canUndo: core.getDocumentViewer().getContentEditHistoryManager().canUndo(),
    canRedo: core.getDocumentViewer().getContentEditHistoryManager().canRedo(),
    handleUndo: handleUndo,
    handleRedo: handleRedo
  };

  const closeTextEditingPanel = () => {
    dispatch(actions.closeElement('textEditingPanel'));
  };

  const renderMobileCloseButton = () => {
    return (
      <div className="close-container">
        <div className="close-icon-container" onClick={closeTextEditingPanel}>
          <Icon glyph="ic_close_black_24px" className="close-icon" />
        </div>
      </div>
    );
  };

  const style =
    !isInDesktopOnlyMode && isMobile
      ? {}
      : { width: `${textEditingPanelWidth}px`, minWidth: `${textEditingPanelWidth}px` };

  if (isDisabled || !isOpen) {
    return null;
  }
  return (
    <DataElementWrapper dataElement="textEditingPanel" className="Panel TextEditingPanel" style={style}>
      {!isInDesktopOnlyMode && isMobile && renderMobileCloseButton()}
      <TextEditingPanel
        undoRedoProperties={undoRedoProperties}
        freeTextMode={selectionMode === 'FreeText'}
        contentSelectMode={selectionMode === 'ContentBox'}
        textEditProperties={textEditProperties}
        handlePropertyChange={handlePropertyChange}
        handleRichTextStyleChange={handleRichTextStyleChange}
        format={format}
        handleTextFormatChange={handleTextFormatChange}
        handleColorChange={handleColorChange}
        fonts={fonts}
        handleAddLinkToText={handleAddLinkToText}
        disableLinkButton={
          (annotationRef.current?.ToolName === window.Core.Tools.ToolNames.ADD_PARAGRAPH) && !contentEditorRef.current
        }
      />
    </DataElementWrapper>
  );
};

export default TextEditingPanelContainer;
