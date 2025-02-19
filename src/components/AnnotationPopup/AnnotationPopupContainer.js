import React, { useState, useEffect, useRef, useCallback, memo, useLayoutEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';

import core from 'core';
import { getAnnotationPopupPositionBasedOn } from 'helpers/getPopupPosition';
import getAnnotationStyles from 'helpers/getAnnotationStyles';
import applyRedactions from 'helpers/applyRedactions';
import { isMobile, isIE } from 'helpers/device';
import { useTranslation } from 'react-i18next';
import { getOpenedWarningModal, getOpenedColorPicker, getDatePicker } from 'helpers/getElements';
import getGroupedLinkAnnotations from 'helpers/getGroupedLinkAnnotations';
import getHashParameters from 'helpers/getHashParameters';
import useOnClickOutside from 'hooks/useOnClickOutside';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import { PRIORITY_THREE } from 'constants/actionPriority';
import getRootNode from 'helpers/getRootNode';

import AnnotationPopup from './AnnotationPopup';
import './AnnotationPopup.scss';

const { ToolNames } = window.Core.Tools;
const { Annotations } = window.Core;

const propTypes = {
  focusedAnnotation: PropTypes.object,
  selectedMultipleAnnotations: PropTypes.bool,
  canModify: PropTypes.bool,
  isStylePopupOpen: PropTypes.bool,
  setIsStylePopupOpen: PropTypes.func,
  isDatePickerOpen: PropTypes.bool,
  setDatePickerOpen: PropTypes.func,
  isDatePickerMount: PropTypes.bool,
  setDatePickerMount: PropTypes.func,
  hasAssociatedLink: PropTypes.bool,
  includesFormFieldAnnotation: PropTypes.bool,
  stylePopupRepositionFlag: PropTypes.bool,
  setStylePopupRepositionFlag: PropTypes.func,
  closePopup: PropTypes.func,
};

const AnnotationPopupContainer = ({
  focusedAnnotation,
  selectedMultipleAnnotations,
  canModify,
  isStylePopupOpen,
  setIsStylePopupOpen,
  isDatePickerOpen,
  setDatePickerOpen,
  isDatePickerMount,
  setDatePickerMount,
  hasAssociatedLink,
  includesFormFieldAnnotation,
  stylePopupRepositionFlag,
  setStylePopupRepositionFlag,
  closePopup,
}) => {
  const [
    isDisabled,
    isOpen,
    isRightClickAnnotationPopupEnabled,
    isNotesPanelDisabled,
    isAnnotationStylePopupDisabled,
    isInlineCommentingDisabled,
    isNotesPanelOpen,
    isLinkModalOpen,
    isRichTextPopupOpen,
    isMultiTab,
    tabManager,
    tabs,
    notesInLeftPanel,
    leftPanelOpen,
    activeLeftPanel,
  ] = useSelector(
    (state) => [
      selectors.isElementDisabled(state, DataElements.ANNOTATION_POPUP),
      selectors.isElementOpen(state, DataElements.ANNOTATION_POPUP),
      selectors.isRightClickAnnotationPopupEnabled(state),
      selectors.isElementDisabled(state, DataElements.NOTES_PANEL),
      selectors.isElementDisabled(state, DataElements.ANNOTATION_STYLE_POPUP),
      selectors.isElementDisabled(state, DataElements.INLINE_COMMENT_POPUP),
      selectors.isElementOpen(state, DataElements.NOTES_PANEL),
      selectors.isElementOpen(state, DataElements.LINK_MODAL),
      selectors.isElementOpen(state, 'richTextPopup'),
      selectors.getIsMultiTab(state),
      selectors.getTabManager(state),
      selectors.getTabs(state),
      selectors.getNotesInLeftPanel(state),
      selectors.isElementOpen(state, DataElements.LEFT_PANEL),
      selectors.getActiveLeftPanel(state),
    ],
    shallowEqual,
  );
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [isCalibrationPopupOpen, setCalibrationPopupOpen] = useState(false);
  const popupRef = useRef();

  const isFocusedAnnotationSelected = isRightClickAnnotationPopupEnabled ? core.isAnnotationSelected(focusedAnnotation) : true;
  const annotManager = core.getAnnotationManager();
  const isNotesPanelOpenOrActive = isNotesPanelOpen || (notesInLeftPanel && leftPanelOpen && activeLeftPanel === 'notesPanel');
  // on tablet, the behaviour will be like on desktop, including being draggable

  useOnClickOutside(
    popupRef,
    useCallback((e) => {
      const notesPanel = getRootNode().querySelector(`[data-element="${DataElements.NOTES_PANEL}"]`);
      const clickedInNotesPanel = notesPanel?.contains(e.target);
      const clickedInLinkModal = getRootNode().querySelector('.LinkModal.open')?.contains(e.target);
      const datePicker = getDatePicker();
      const warningModal = getOpenedWarningModal();
      const colorPicker = getOpenedColorPicker();

      // the notes panel has mousedown handlers to handle the opening/closing states of this component
      // we don't want this handler to run when clicked in the notes panel otherwise the opening/closing states may mess up
      // for example: click on a note will call core.selectAnnotation which triggers the annotationSelected event
      // and opens this component. If we don't exclude the notes panel this handler will run and close it after
      if (!clickedInNotesPanel && !clickedInLinkModal && !warningModal && !colorPicker && !datePicker) {
        if (isRightClickAnnotationPopupEnabled) {
          closePopup();
        } else {
          dispatch(actions.closeElement(DataElements.ANNOTATION_POPUP));
        }
      }
    }, [isRightClickAnnotationPopupEnabled])
  );

  const setPopupPosition = () => {
    if (popupRef.current) {
      setPosition(getAnnotationPopupPositionBasedOn(focusedAnnotation, popupRef));
    }
  };

  // useLayoutEffect here to avoid flashing issue when popup is close and open on scroll
  useLayoutEffect(() => {
    if (focusedAnnotation || isStylePopupOpen || isDatePickerMount) {
      setPopupPosition();
    }
    // canModify is needed here because the effect from useOnAnnotationPopupOpen hook will run again and determine which button to show, which in turn change the popup size and will need to recalculate position
  }, [focusedAnnotation, isStylePopupOpen, isDatePickerMount, canModify]);


  useEffect(() => {
    if (focusedAnnotation && focusedAnnotation.ToolName === ToolNames.CALIBRATION_MEASUREMENT) {
      setCalibrationPopupOpen(true);
    }
  }, [focusedAnnotation]);

  useEffect(() => {
    if (isOpen || isRichTextPopupOpen) {
      dispatch(actions.closeElement(DataElements.INLINE_COMMENT_POPUP));
    }
  }, [isOpen, isRichTextPopupOpen]);

  /* VIEW FILE */
  const wvServer = !!getHashParameters('webviewerServerURL', null);
  const acceptFormats = wvServer ? window.Core.SupportedFileFormats.SERVER : window.Core.SupportedFileFormats.CLIENT;
  const showViewFileButton = focusedAnnotation instanceof Annotations.FileAttachmentAnnotation && isMultiTab
    && acceptFormats.includes(window.Core.mimeTypeToExtension[focusedAnnotation.getFileMetadata().mimeType]);

  const onViewFile = useCallback(async () => {
    if (!tabManager || !isMultiTab) {
      return console.warn('Can\'t open file in non-multi-tab mode');
    }
    const metaData = focusedAnnotation.getFileMetadata();
    const fileAttachmentTab = tabs.find((tab) => tab.options.filename === metaData.filename);
    if (fileAttachmentTab) { // If already opened once
      await tabManager.setActiveTab(fileAttachmentTab.id, true);
      return;
    }
    await tabManager.addTab(await focusedAnnotation.getFileData(), {
      extension: window.Core.mimeTypeToExtension[metaData.mimeType],
      filename: metaData.filename,
      saveCurrentActiveTabState: true,
      setActive: true,
    });
  }, [tabManager, focusedAnnotation, tabs, isMultiTab]);

  /* ALL REACT HOOKS NEED TO BE BEFORE RENDERING */
  if (isDisabled || !focusedAnnotation) {
    return null;
  }

  /* COMMENT / DATE */
  const selectedAnnotations = core.getSelectedAnnotations();
  const numberOfSelectedAnnotations = selectedAnnotations.length;
  const multipleAnnotationsSelected = numberOfSelectedAnnotations > 1;
  const isFreeTextAnnot = focusedAnnotation instanceof Annotations.FreeTextAnnotation;
  const isDateFreeTextCanEdit = isFreeTextAnnot && !!focusedAnnotation.getDateFormat() && core.canModifyContents(focusedAnnotation);
  const numberOfGroups = core.getNumberOfGroups(selectedAnnotations);
  const canGroup = numberOfGroups > 1;
  const canUngroup = numberOfGroups === 1 && numberOfSelectedAnnotations > 1 && isFocusedAnnotationSelected;
  const isAppearanceSignature =
    focusedAnnotation instanceof Annotations.SignatureWidgetAnnotation
    && focusedAnnotation.isSignedByAppearance();

  const showCommentButton = (
    (!isNotesPanelDisabled || !isInlineCommentingDisabled)
    && (!multipleAnnotationsSelected || (multipleAnnotationsSelected && !isFocusedAnnotationSelected))
    && focusedAnnotation.ToolName !== ToolNames.CROP
    && !includesFormFieldAnnotation
    && !focusedAnnotation.isContentEditPlaceholder()
    && !focusedAnnotation.isUncommittedContentEditPlaceholder()
    && !isAppearanceSignature
  );

  const onCommentAnnotation = () => {
    if (isDateFreeTextCanEdit) {
      setDatePickerOpen(true);
      return;
    }

    dispatch(actions.closeElement('searchPanel'));
    dispatch(actions.closeElement('redactionPanel'));
    const contentEditManager = core.getContentEditManager();
    if (contentEditManager.isInContentEditMode()) {
      dispatch(actions.closeElement('textEditingPanel'));
      contentEditManager.endContentEditMode();
    }

    dispatch(actions.triggerNoteEditing());
    if (isInlineCommentingDisabled) {
      dispatch(actions.openElement(DataElements.NOTES_PANEL));
      dispatch(actions.closeElement(DataElements.ANNOTATION_POPUP));
    } else {
      if (!isNotesPanelOpen) {
        dispatch(actions.openElement(DataElements.INLINE_COMMENT_POPUP));
      }
      closePopup();
    }
  };

  const handleDateChange = (text) => {
    annotManager.setNoteContents(focusedAnnotation, text);
    annotManager.updateAnnotation(focusedAnnotation);
  };

  const onDatePickerShow = (isDatePickerShowed) => {
    setDatePickerMount(isDatePickerShowed);
  };

  /* EDIT STYLE */
  const annotationStyle = getAnnotationStyles(focusedAnnotation);
  const hasStyle = Object.keys(annotationStyle).length > 0;

  const toolsWithNoStyling = [
    ToolNames.CROP,
    ToolNames.RADIO_FORM_FIELD,
    ToolNames.CHECK_BOX_FIELD,
    ToolNames.VIDEO_REDACTION,
    ToolNames.VIDEO_AND_AUDIO_REDACTION,
    ToolNames.AUDIO_REDACTION,
  ];

  const showEditStyleButton = (
    canModify
    && hasStyle
    && !isAnnotationStylePopupDisabled
    && (!multipleAnnotationsSelected || canUngroup || (multipleAnnotationsSelected && !isFocusedAnnotationSelected))
    && !toolsWithNoStyling.includes(focusedAnnotation.ToolName)
    && !(focusedAnnotation instanceof Annotations.Model3DAnnotation)
    && !focusedAnnotation.isContentEditPlaceholder()
    && !focusedAnnotation.isUncommittedContentEditPlaceholder()
    && !isAppearanceSignature
  );

  const hideSnapModeCheckbox = focusedAnnotation instanceof Annotations.EllipseAnnotation || !core.isFullPDFEnabled();

  const onResize = () => {
    setStylePopupRepositionFlag(!stylePopupRepositionFlag);
  };

  /* EDIT CONTENT */
  const showContentEditButton =
    focusedAnnotation.isContentEditPlaceholder()
    && focusedAnnotation.getContentEditType() === window.Core.ContentEdit.Types.TEXT;

  const onEditContent = async () => {
    // TODO: remove this from the state and nuke the modal
    if (isMobile()) {
      const content = await window.Core.ContentEdit.getDocumentContent(focusedAnnotation);
      dispatch(actions.setCurrentContentBeingEdited({ content, annotation: focusedAnnotation }));
      dispatch(actions.openElement(DataElements.CONTENT_EDIT_MODAL));
    } else {
      annotManager.trigger('annotationDoubleClicked', focusedAnnotation);
    }
    dispatch(actions.closeElement(DataElements.ANNOTATION_POPUP));
  };

  /* CLEAR APPEARANCE SIGNATURE */
  const onClearAppearanceSignature = () => {
    focusedAnnotation.clearSignature(annotManager);
    dispatch(actions.closeElement(DataElements.ANNOTATION_POPUP));
  };

  /* REDACTION */
  const redactionEnabled = core.isAnnotationRedactable(focusedAnnotation);
  const showRedactionButton = redactionEnabled && !multipleAnnotationsSelected && !includesFormFieldAnnotation;

  const onApplyRedaction = () => {
    dispatch(applyRedactions(focusedAnnotation));
    dispatch(actions.closeElement(DataElements.ANNOTATION_POPUP));
  };

  /* GROUP / UNGROUP */
  const primaryAnnotation = selectedAnnotations.find((selectedAnnotation) => !selectedAnnotation.InReplyTo);

  const showGroupButton =
    isFocusedAnnotationSelected
    && canGroup
    && !includesFormFieldAnnotation;

  const onGroupAnnotations = () => {
    core.groupAnnotations(primaryAnnotation, selectedAnnotations);
  };

  const showUngroupButton = canUngroup;

  const onUngroupAnnotations = () => {
    core.ungroupAnnotations(selectedAnnotations);
  };

  /* FORM FIELD */
  const formFieldCreationManager = core.getFormFieldCreationManager();
  const isInFormFieldCreationMode = formFieldCreationManager.isInFormFieldCreationMode();
  const showFormFieldButton = includesFormFieldAnnotation && isInFormFieldCreationMode;

  const onOpenFormField = () => {
    closePopup();
    // We disable it while the form field popup is open to prevent having both open
    // at the same time. We re-enable it when the form field popup is closed.
    dispatch(actions.disableElement(DataElements.ANNOTATION_POPUP, PRIORITY_THREE));
    dispatch(actions.openElement(DataElements.FORM_FIELD_EDIT_POPUP));
  };

  /* DELETE ANNOTATION */
  const showDeleteButton = canModify;

  const openContentEditDeleteWarningModal = () => {
    const message = t('option.contentEdit.deletionModal.message');
    const title = t('option.contentEdit.deletionModal.title');
    const confirmBtnText = t('action.ok');

    const warning = {
      message,
      title,
      confirmBtnText,
      onConfirm: () => onDeleteAnnotation(),
    };
    dispatch(actions.showWarningMessage(warning));
  };

  const onDeleteAnnotation = () => {
    if (isFocusedAnnotationSelected) {
      core.deleteAnnotations(core.getSelectedAnnotations());
    } else {
      core.deleteAnnotations([focusedAnnotation]);
    }
    closePopup();
  };

  /* LINK ANNOTATION */
  const toolsThatCantHaveLinks = [
    ToolNames.CROP,
    ToolNames.SIGNATURE,
    ToolNames.REDACTION,
    ToolNames.REDACTION2,
    ToolNames.REDACTION3,
    ToolNames.REDACTION4,
    ToolNames.STICKY,
    ToolNames.STICKY2,
    ToolNames.STICKY3,
    ToolNames.STICKY4,
  ];

  const showLinkButton = (
    !toolsThatCantHaveLinks.includes(focusedAnnotation.ToolName)
    && !includesFormFieldAnnotation
    && !focusedAnnotation.isContentEditPlaceholder()
    // TODO(Adam): Update this once SoundAnnotation tool is created.
    && !(focusedAnnotation instanceof Annotations.SoundAnnotation)
    && !focusedAnnotation.isUncommittedContentEditPlaceholder()
    && !isAppearanceSignature
  );

  const showCalibrateButton =
    canModify
    && focusedAnnotation.Measure
    && focusedAnnotation instanceof Annotations.LineAnnotation;

  const onOpenCalibration = () => {
    dispatch(actions.closeElement(DataElements.ANNOTATION_POPUP));
    dispatch(actions.openElement(DataElements.CALIBRATION_MODAL));
  };

  const linkAnnotationToURL = () => {
    if (hasAssociatedLink) {
      const annotationsToUnlink = isFocusedAnnotationSelected ? selectedAnnotations : [focusedAnnotation];
      annotationsToUnlink.forEach((annot) => {
        const linkAnnotations = getGroupedLinkAnnotations(annot);
        linkAnnotations.forEach((linkAnnot, index) => {
          annotManager.ungroupAnnotations([linkAnnot]);
          if (annot instanceof Annotations.TextHighlightAnnotation && annot.Opacity === 0 && index === 0) {
            annotManager.deleteAnnotations([annot, linkAnnot], null, true);
          } else {
            annotManager.deleteAnnotation(linkAnnot, null, true);
          }
        });
      });
      closePopup();
    } else {
      dispatch(actions.openElement(DataElements.LINK_MODAL));
    }
  };

  /* DOWNLOAD FILE ATTACHMENT */
  const showFileDownloadButton = focusedAnnotation instanceof Annotations.FileAttachmentAnnotation;

  const downloadFileAttachment = (annot) => {
    // no need to check that annot is of type file annot as the check is done in the JSX
    // trigger the annotationDoubleClicked event so that it will download the file
    annotManager.trigger('annotationDoubleClicked', annot);
  };

  /* AUDIO ANNOTATION */
  const showAudioPlayButton = (
    !isIE &&
    !selectedMultipleAnnotations &&
    focusedAnnotation instanceof Annotations.SoundAnnotation &&
    focusedAnnotation.hasAudioData()
  );

  const handlePlaySound = (annotation) => {
    dispatch(actions.setActiveSoundAnnotation(annotation));
    dispatch(actions.triggerResetAudioPlaybackPosition(true));
    dispatch(actions.openElement('audioPlaybackPopup'));
  };

  return (
    <AnnotationPopup
      isMobile={isMobile()}
      isIE={isIE}
      isOpen={isOpen}
      isRightClickMenu={isRightClickAnnotationPopupEnabled}
      isNotesPanelOpenOrActive={isNotesPanelOpenOrActive}
      isRichTextPopupOpen={isRichTextPopupOpen}
      isLinkModalOpen={isLinkModalOpen}

      popupRef={popupRef}
      position={position}
      focusedAnnotation={focusedAnnotation}

      showViewFileButton={showViewFileButton}
      onViewFile={onViewFile}

      showCommentButton={showCommentButton}
      onCommentAnnotation={onCommentAnnotation}
      isDateFreeTextCanEdit={isDateFreeTextCanEdit}
      isDatePickerOpen={isDatePickerOpen}
      handleDateChange={handleDateChange}
      onDatePickerShow={onDatePickerShow}
      isCalibrationPopupOpen={isCalibrationPopupOpen}

      showEditStyleButton={showEditStyleButton}
      isStylePopupOpen={isStylePopupOpen}
      hideSnapModeCheckbox={hideSnapModeCheckbox}
      openEditStylePopup={() => setIsStylePopupOpen(true)}
      closeEditStylePopup={() => setIsStylePopupOpen(false)}
      annotationStyle={annotationStyle}
      onResize={onResize}

      showContentEditButton={showContentEditButton}
      onEditContent={onEditContent}
      openContentEditDeleteWarningModal={openContentEditDeleteWarningModal}

      isAppearanceSignature={isAppearanceSignature}
      onClearAppearanceSignature={onClearAppearanceSignature}

      showRedactionButton={showRedactionButton}
      onApplyRedaction={onApplyRedaction}

      showGroupButton={showGroupButton}
      onGroupAnnotations={onGroupAnnotations}
      showUngroupButton={showUngroupButton}
      onUngroupAnnotations={onUngroupAnnotations}

      showFormFieldButton={showFormFieldButton}
      onOpenFormField={onOpenFormField}

      showDeleteButton={showDeleteButton}
      onDeleteAnnotation={onDeleteAnnotation}

      showLinkButton={showLinkButton}
      hasAssociatedLink={hasAssociatedLink}
      linkAnnotationToURL={linkAnnotationToURL}

      showFileDownloadButton={showFileDownloadButton}
      downloadFileAttachment={downloadFileAttachment}

      showAudioPlayButton={showAudioPlayButton}
      handlePlaySound={handlePlaySound}

      showCalibrateButton={showCalibrateButton}
      onOpenCalibration={onOpenCalibration}
    />
  );
};

AnnotationPopupContainer.propTypes = propTypes;

export default memo(AnnotationPopupContainer);
