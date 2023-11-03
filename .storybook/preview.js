import core from 'core';
import I18nDecorator from "./I18nDecorator";
import 'react-quill/dist/quill.snow.css';

import '../src/index.scss';
import '../src/components/App/App.scss';

// We add this class to the StoryBook root element to mimick how we have
// structured our classes in the UI, where everythign is wrapped by the App class.
// If this is not done we miss some styles, and the Stories will look a bit different.
document.getElementById('root').className = 'App';

function noop() {
}

// Some helpful mocked annotations
let rectangle;
let freeText;
let distanceMeasurement;

let docType = 'PDF';
window.setDocType = (type) => {
  console.log('setDocType', type);
  docType = type;
};
function noop() {
}

// Some helpful mocked annotations
let rectangle;
let freeText;
let distanceMeasurement;

let docType = 'PDF';
window.setDocType = (type) => {
  console.log('setDocType', type);
  docType = type;
};

const mockTool = {
  name: 'AnnotationCreateFreeHand',
  defaults: {
    StrokeColor: {
      R: 0,
      G: 122,
      B: 59,
      A: 1,
      toHexString: () => '#007a3b'
    },
    StrokeThickness: 1,
    Opacity: 1,
  },
  clearSignatureCanvas: noop,
  setSignatureCanvas: noop,
  setSignature: noop,
  resizeCanvas: noop,
  drawCustomStamp: () => 300,
  clearOutlineDestination: noop,
  setInitialsCanvas: noop,
  setInitials: noop,
  clearInitialsCanvas: noop,
  setStyles: noop,
  finish: noop,
  getIsCropping: () => false,
  getIsSnipping: () => false,
  setSnippingMode: noop,
  getPagesToCrop: noop,
  setCropMode: noop,
  addEventListener: noop,
  removeEventListener: noop,
};

const mockAnnotationManager = {
  exportAnnotations: noop,
  redrawAnnotation: noop,
  redrawAnnotations: noop,
  getEditBoxManager: noop,
  getFormFieldCreationManager: noop,
  getDisplayAuthor: (userId) => userId,
  deselectAllAnnotations: noop,
  selectAnnotation: noop,
  jumpToAnnotation: noop,
  setAnnotationStyles: noop,
  updateAnnotationRichTextStyle: noop,
  getCurrentUser: noop,
  getSelectedAnnotations: () => [],
  getAnnotationsList: () => ([
    rectangle,
    freeText,
    distanceMeasurement,
  ]),
  addEventListener: noop,
  removeEventListener: noop,
  getGroupAnnotations: () => [],
  canModifyContents: () => true,
  canModify: () => true,
  setNoteContents: () => '',
  trigger: noop,
  hideAnnotations: noop,
  isCreateRedactionEnabled: noop,
  disableRedaction: noop,
  setAnnotationCanvasTransform: noop,
  drawAnnotations: noop,
};

const mockFormFieldCreationManager = {
  isInFormFieldCreationMode: () => false,
  startFormFieldCreationMode: noop,
  endFormFieldCreationMode: noop,
};

function generateCanvasWithImage() {
  const canvas = document.createElement('canvas');
  canvas.width = 116;
  canvas.height = 150;

  const ctx = canvas.getContext('2d');

  return new Promise((resolve) => {
    const img = new Image();
    img.src = "https://placekitten.com/200/300?image=5";
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas);
    };
  });
}

const mockDocument = {
  getPageInfo: () => ({
    width: DEFAULT_PAGE_HEIGHT,
    height: DEFAULT_PAGE_WIDTH
  }),
  getType: () => docType,
  getFilename: () => 'test',
  loadCanvas: async ({ drawComplete }) => {
    const canvas = await generateCanvasWithImage();
    drawComplete(canvas);
  },
  getBookmarks: () => new Promise((res, rej) => res),
  getViewerCoordinates: () => ({ x: 0, y: 0 }),
  setLayersArray: noop,
  isWebViewerServerDocument: () => false,
};

const mockDisplayModeManager = {
  isVirtualDisplayEnabled: () => true,
};

const mockDocumentViewer = {
  doc: {},
  getDocument: () => mockDocument,
  getPageCount: () => 9,
  getAnnotationManager: () => mockAnnotationManager,
  getRotation: () => 0,
  getCompleteRotation: () => 0,
  clearSearchResults: noop,
  getTool: (toolName) => mockTool,
  setWatermark: noop,
  getPageHeight: () => DEFAULT_PAGE_HEIGHT,
  getPageWidth: () => DEFAULT_PAGE_WIDTH,
  setCurrentPage: (page) => {
  },
  setBookmarkIconShortcutVisibility: noop,
  displayBookmark: noop,
  addEventListener: noop,
  removeEventListener: noop,
  getAnnotationHistoryManager: noop,
  getMeasurementManager: noop,
  getToolModeMap: () => ({}),
  getWatermark: () => Promise.resolve(),
  getDisplayModeManager: () => mockDisplayModeManager,
  getContentEditHistoryManager: () => ({
    canUndo: noop,
    canRedo: noop,
  }),
  getViewerElement: noop,
  scrollViewUpdated: noop,
  setBookmarkShortcutToggleOnFunction: noop,
  setBookmarkShortcutToggleOffFunction: noop,
  setUserBookmarks: noop,
  getToolMode: noop,
  getAnnotationsLoadedPromise: () => Promise.resolve(),
  getDisplayModeManager: noop,
  refreshAll: noop,
  updateView: noop
};

core.getTool = () => mockTool;
core.setToolMode = noop;
core.isFullPDFEnabled = () => { return false; };
core.addEventListener = () => { };
core.removeEventListener = () => { };
core.getFormFieldCreationManager = () => mockFormFieldCreationManager;
core.getDocumentViewer = () => mockDocumentViewer;
core.getDocumentViewers = () => [mockDocumentViewer];
core.getDisplayAuthor = (author) => author ? author : 'Duncan Idaho';
core.getAnnotationManager = () => mockAnnotationManager;
core.getCurrentPage = () => 1;
core.setScrollViewElement = noop;
core.setViewerElement = noop;
core.getScrollViewElement = () => ({
  scrollTop: 0,
  addEventListener: noop,
  removeEventListener: noop,
  getBoundingClientRect: () => ({
    bottom: 726,
    height: 726,
    left: 0,
    right: 2149,
    top: 0,
    width: 2149,
    x: 0,
    y: 0,
  })
});
core.getContentEditManager = () => ({
  isInContentEditMode: () => false,
});

window.Core = {
  documentViewer: mockDocumentViewer,
  annotationManager: mockAnnotationManager,
  AnnotationManager: mockAnnotationManager,
  Tools: {
    ToolNames: {
      'ARROW': 'AnnotationCreateArrow',
      'CALLOUT': 'AnnotationCreateCallout',
      'ELLIPSE': 'AnnotationCreateEllipse',
      'FREEHAND': 'AnnotationCreateFreeHand',
      'FREEHAND_HIGHLIGHT': 'AnnotationCreateFreeHandHighlight',
      'FREETEXT': 'AnnotationCreateFreeText',
      'MARK_INSERT_TEXT': 'AnnotationCreateMarkInsertText',
      'MARK_REPLACE_TEXT': 'AnnotationCreateMarkReplaceText',
      'DATE_FREETEXT': 'AnnotationCreateDateFreeText',
      'LINE': 'AnnotationCreateLine',
      'POLYGON': 'AnnotationCreatePolygon',
      'POLYGON_CLOUD': 'AnnotationCreatePolygonCloud',
      'POLYLINE': 'AnnotationCreatePolyline',
      'ARC': 'AnnotationCreateArc',
      'RECTANGLE': 'AnnotationCreateRectangle',
      'CALIBRATION_MEASUREMENT': 'AnnotationCreateCalibrationMeasurement',
      'DISTANCE_MEASUREMENT': 'AnnotationCreateDistanceMeasurement',
      'PERIMETER_MEASUREMENT': 'AnnotationCreatePerimeterMeasurement',
      'ARC_MEASUREMENT': 'AnnotationCreateArcMeasurement',
      'AREA_MEASUREMENT': 'AnnotationCreateAreaMeasurement',
      'RECTANGULAR_AREA_MEASUREMENT': 'AnnotationCreateRectangularAreaMeasurement',
      'ELLIPSE_MEASUREMENT': 'AnnotationCreateEllipseMeasurement',
      'COUNT_MEASUREMENT': 'AnnotationCreateCountMeasurement',
      'SIGNATURE': 'AnnotationCreateSignature',
      'STAMP': 'AnnotationCreateStamp',
      'FILEATTACHMENT': 'AnnotationCreateFileAttachment',
      'RUBBER_STAMP': 'AnnotationCreateRubberStamp',
      'FORM_FILL_CROSS': 'AnnotationCreateCrossStamp',
      'FORM_FILL_CHECKMARK': 'AnnotationCreateCheckStamp',
      'FORM_FILL_DOT': 'AnnotationCreateDotStamp',
      'STICKY': 'AnnotationCreateSticky',
      'HIGHLIGHT': 'AnnotationCreateTextHighlight',
      'SQUIGGLY': 'AnnotationCreateTextSquiggly',
      'STRIKEOUT': 'AnnotationCreateTextStrikeout',
      'UNDERLINE': 'AnnotationCreateTextUnderline',
      'REDACTION': 'AnnotationCreateRedaction',
      'TEXT_SELECT': 'TextSelect',
      'EDIT': 'AnnotationEdit',
      'PAN': 'Pan',
      'CONTENT_EDIT': 'ContentEditTool',
      'ADD_PARAGRAPH': 'AddParagraphTool',
      'ADD_IMAGE_CONTENT': 'AddImageContentTool',
      'CROP': 'CropPage',
      'SNIPPING': 'SnippingTool',
      'ERASER': 'AnnotationEraserTool',
      'TEXT_FORM_FIELD': 'TextFormFieldCreateTool',
      'SIG_FORM_FIELD': 'SignatureFormFieldCreateTool',
      'CHECK_BOX_FIELD': 'CheckBoxFormFieldCreateTool',
      'RADIO_FORM_FIELD': 'RadioButtonFormFieldCreateTool',
      'LIST_BOX_FIELD': 'ListBoxFormFieldCreateTool',
      'COMBO_BOX_FIELD': 'ComboBoxFormFieldCreateTool',
      'CHANGEVIEW': 'AnnotationCreateChangeViewTool',
    },
    RubberStampCreateTool: {
      FILL_COLORS: ['#4F9964', '#2A85D0', '#D65656'],
      TEXT_COLORS: ['#FFFFFF', '#000000']
    },
    SignatureCreateTool: {
      SignatureTypes: {
        FULL_SIGNATURE: 'fullSignature',
        INITIALS: 'initialsSignature'
      },
    },
    CropPage: {
      getIsCropping: () => false,
    }
  },
  getHashParameter: (hashParameter, defaultValue) => {
    if (hashParameter === 'a') {
      return true;
    }
    return defaultValue;
  },
  SupportedFileFormats: {
    CLIENT: [],
  },
  isBlendModeSupported: () => true,
  FontStyles: { BOLD: 'BOLD', ITALIC: 'ITALIC', UNDERLINE: 'UNDERLINE' },
  getCanvasMultiplier: () => 1,
  Scale: () => {
    return {
      pageScale: {
        value: 1,
        unit: 'in'
      },
      worldScale: {
        value: 1,
        unit: 'in'
      },
      toString: () => '1 in = 1 in',
      getScaleRatioAsArray: () => [[1, 'in'], [1, 'in']],
      isValid: () => true
    }
  },
  Document: {
    OfficeEditorListStylePresets: {
      '0': 'BULLET',
      '1': 'BULLET_SQUARE',
      '2': 'SQUARE_BULLET',
      '3': 'DIAMOND',
      '4': 'CHECK',
      '5': 'ARROW',
      '6': 'NUMBER_LATIN_ROMAN_1',
      '7': 'NUMBER_DECIMAL',
      '8': 'NUMBER_LATIN_ROMAN_2',
      '10': 'LATIN_ROMAN',
      '11': 'ROMAN_LATIN_NUMBER'
    }
  },
  setBasePath: noop,
};

const DEFAULT_PAGE_HEIGHT = 792;
const DEFAULT_PAGE_WIDTH = 612;

window.documentViewer = {
  doc: {},
  getDocument: () => mockDocument,
  getPageCount: () => 9,
  getAnnotationManager: () => mockAnnotationManager,
  getAnnotationHistoryManager: () => ({}),
  getRotation: () => 0,
  clearSearchResults: noop,
  getTool: (toolName) => mockTool,
  setWatermark: noop,
  getPageHeight: () => DEFAULT_PAGE_HEIGHT,
  getPageWidth: () => DEFAULT_PAGE_WIDTH,
  setCurrentPage: (page) => {
  },
  setBookmarkIconShortcutVisibility: noop,
  displayBookmark: noop,
};



// For an example of how these mock classes are used refer to AnnotationStylePopupStories.js
// However, it is preferrable to mock your annotation objects directly in your stories. These mocks are largely
// to support stories for components that rely on code that is calling methods/objects from the window object.
// For an example of the preferred mocking method refer to RedactionPageGroup.stories.js
class MockAnnotation {
  isFormFieldPlaceholder = () => false;
  getCustomData = () => '';
  static datePickerOptions = {};
}

class MockLineAnnotation {
  isFormFieldPlaceholder = () => false;
  getStartStyle = () => 'None';
  getEndStyle = () => 'None';
  getIntent = () => null;
  getLineLength = () => 10;
  Opacity = 1;
  StrokeThickness = 1;
};

class MockFreeTextAnnotation {
  static Intent = {
    FreeText: 'FreeText',
  }
  getIntent = () => 'FreeText';
  getRichTextStyle = () => null;
  isFormFieldPlaceholder = () => false;
  getCustomData = () => '';
  setLineStyle = () => { };
};

class MockRectangleAnnotation {
  isFormFieldPlaceholder = () => false;
  getCustomData = () => '';
}

class MockEllipseAnnotation {
  getIntent = () => 'EllipseDimension';
  getCustomData = () => '';
}

window.Core.Annotations = {
  Annotation: {
    MeasurementUnits: {},
  },
  FreeTextAnnotation: MockFreeTextAnnotation,
  FreeHandAnnotation: MockAnnotation,
  LineAnnotation: MockLineAnnotation,
  PolylineAnnotation: MockAnnotation,
  ArcAnnotation: MockAnnotation,
  PolygonAnnotation: MockAnnotation,
  EllipseAnnotation: MockEllipseAnnotation,
  StickyAnnotation: MockAnnotation,
  TextHighlightAnnotation: MockAnnotation,
  TextUnderlineAnnotation: MockAnnotation,
  TextSquigglyAnnotation: MockAnnotation,
  TextStrikeoutAnnotation: MockAnnotation,
  RedactionAnnotation: MockAnnotation,
  RectangleAnnotation: MockRectangleAnnotation,
  StampAnnotation: MockAnnotation,
  FileAttachmentAnnotation: MockAnnotation,
  SoundAnnotation: MockAnnotation,
  Model3DAnnotation: MockAnnotation,
  WidgetAnnotation: MockAnnotation,
  Link: MockAnnotation,
  CaretAnnotation: MockAnnotation,
  CustomAnnotation: MockAnnotation,
  SignatureWidgetAnnotation: MockAnnotation,
  DatePickerWidgetAnnotation: MockAnnotation,
  Forms: {
    Field: MockAnnotation,
  }
}

const colorToHexString = (color) => {
  if (typeof color === 'undefined' || color === null) {
    return null;
  }
  if (color['A'] === 0) {
    return null;
  }
  let r = color['R'].toString(16).toUpperCase();
  if (r.length < 2) {
    r = `0${r}`;
  }
  let g = color['G'].toString(16).toUpperCase();
  if (g.length < 2) {
    g = `0${g}`;
  }
  let b = color['B'].toString(16).toUpperCase();
  if (b.length < 2) {
    b = `0${b}`;
  }

  return `#${r}${g}${b}`;
};

const hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

Core.Annotations.Color = (R = 255, G = 0, B = 0) => {
  if (R[0] === '#') {
    const { r, g, b } = hexToRgb(R);
    return {
      R: r,
      G: g,
      B: b,
      A: 1,
      toHexString: () => R
    };
  }

  if (R instanceof Object) {
    return R;
  }
  const toHexString = () => {
    return colorToHexString({ R, G, B });
  };
  return { R, G, B, A: 1, toHexString };
};

export const decorators = [
  I18nDecorator,
];

rectangle = new window.Core.Annotations.RectangleAnnotation();
rectangle.Author = 'Guest_1';
rectangle.getStatus = () => null;
rectangle.getCustomData = () => '';
rectangle.StrokeColor = new window.Core.Annotations.Color(255, 0, 0);

freeText = new window.Core.Annotations.FreeTextAnnotation();
freeText.Author = 'Guest_2';
freeText.getStatus = () => null;
freeText.TextColor = new window.Core.Annotations.Color(0, 255, 0);

distanceMeasurement = new window.Core.Annotations.LineAnnotation();
distanceMeasurement.IT = 'LineDimension';
distanceMeasurement.getStatus = () => null;
distanceMeasurement.StrokeColor = new window.Core.Annotations.Color(255, 0, 0);
distanceMeasurement.Measure = {};