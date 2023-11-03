// TODO - Add more here
const DataElements = {
  LEGACY_RICH_TEXT_POPUP: 'legacyRichTextPopup',
  ANNOTATION_NOTE_CONNECTOR_LINE: 'annotationNoteConnectorLine',
  ANNOTATION_STYLE_POPUP: 'annotationStylePopup',
  ANNOTATION_STYLE_POPUP_BACK_BUTTON: 'annotationStylePopupBackButton',
  ANNOTATION_STYLE_POPUP_BACK_BUTTON_CONTAINER: 'annotationStylePopupBackButtonContainer',
  INLINE_COMMENT_POPUP_EXPAND_BUTTON: 'inlineCommentPopupExpandButton',
  INLINE_COMMENT_POPUP_CLOSE_BUTTON: 'inlineCommentPopupCloseButton',

  LOGO_BAR: 'logoBar',
  COLOR_PALETTE: 'colorPalette',
  OPACITY_SLIDER: 'opacitySlider',
  STROKE_THICKNESS_SLIDER: 'strokeThicknessSlider',
  FONT_SIZE_SLIDER: 'fontSizeSlider',
  STYLE_OPTION: 'styleOption',
  STYLE_POPUP: 'stylePopup',
  SCALE_INPUT_CONTAINER: 'scaleInputContainer',
  PRECISION_INPUT_CONTAINER: 'precisionInputContainer',
  STYLE_POPUP_TEXT_STYLE_CONTAINER: 'stylePopupTextStyleContainer',
  STYLE_POPUP_COLORS_CONTAINER: 'stylePopupColorsContainer',
  STYLE_POPUP_LABEL_TEXT_CONTAINER: 'stylePopupLabelTextContainer',
  REDACTION_PANEL: 'redactionPanel',
  REDACTION_PANEL_TOGGLE: 'redactionPanelToggle',
  WV3D_PROPERTIES_PANEL: 'wv3dPropertiesPanel',
  WV3D_PROPERTIES_PANEL_TOGGLE: 'wv3dPropertiesPanelToggle',
  LEFT_PANEL: 'leftPanel',
  OUTLINE_PANEL: 'outlinesPanel',
  OUTLINE_MULTI_SELECT: 'outlineMultiSelect',
  OUTLINE_CONTROLS: 'outlineControls',
  OUTLINE_ADD_NEW_BUTTON_CONTAINER: 'addNewOutlineButtonContainer',
  OUTLINE_ADD_NEW_BUTTON: 'addNewOutlineButton',
  OUTLINE_MOVE_UP_BUTTON: 'moveOutlineUpButton',
  OUTLINE_MOVE_DOWN_BUTTON: 'moveOutlineDownButton',
  OUTLINE_MOVE_OUTWARD_BUTTON: 'moveOutlineOutwardButton',
  OUTLINE_MOVE_INWARD_BUTTON: 'moveOutlineInwardButton',
  BOOKMARK_PANEL: 'bookmarksPanel',
  BOOKMARK_MULTI_SELECT: 'bookmarkMultiSelect',
  BOOKMARK_SHORTCUT_OPTION: 'bookmarkShortcutOption',
  BOOKMARK_ADD_NEW_BUTTON_CONTAINER: 'addNewBookmarkButtonContainer',
  BOOKMARK_ADD_NEW_BUTTON: 'addNewBookmarkButton',
  NOTES_PANEL: 'notesPanel',
  FORM_FIELD_INDICATOR_CONTAINER: 'formFieldIndicatorContainer',
  WATERMARK_PANEL: 'watermarkPanel',
  WATERMARK_PANEL_TOGGLE: 'watermarkPanelToggle',
  WATERMARK_PANEL_IMAGE_TAB: 'watermarkPanelImageTab',
  WATERMARK_PANEL_TEXT_TAB: 'watermarkPanelTextTab',
  SEARCH_PANEL: 'searchPanel',
  TEXT_EDITING_PANEL: 'textEditingPanel',
  COMPARE_PANEL: 'comparePanel',
  PORTFOLIO_PANEL: 'portfolioPanel',
  PORTFOLIO_PANEL_BUTTON: 'portfolioPanelButton',
  PORTFOLIO_ADD_FILE: 'portfolioAddFile',
  PORTFOLIO_ADD_FOLDER: 'portfolioAddFolder',
  PORTFOLIO_ADD_NEW_BUTTON: 'portfolioAddNewButton',
  CALIBRATION_POPUP_BUTTON: 'calibratePopupButton',
  CALIBRATION_MODAL: 'calibrationModal',

  NotesPanel: {
    DefaultHeader: {
      INPUT_CONTAINER: 'notesPanelHeader-inputContainer',
      COMMENTS_COUNTER: 'notesPanelHeader-commentsCounter',
      SORT_ROW: 'notesPanelHeader-sortRow'
    },
    ADD_REPLY_ATTACHMENT_BUTTON: 'addReplyAttachmentButton'
  },
  MULTITABS_EMPTY_PAGE: 'multiTabsEmptyPage',

  // Overlays
  SCALE_OVERLAY_CONTAINER: 'scaleOverlayContainer',
  MEASUREMENT_OVERLAY: 'measurementOverlay',
  VIEW_CONTROLS_OVERLAY: 'viewControlsOverlay',
  VIEW_CONTROLS_OVERLAY_BUTTON: 'viewControlsButton',
  SEARCH_OVERLAY: 'searchOverlay',
  MENU_OVERLAY: 'menuOverlay',
  MENU_OVERLAY_BUTTON: 'menuButton',
  ZOOM_OVERLAY: 'zoomOverlay',
  ZOOM_OVERLAY_BUTTON: 'zoomOverlayButton',
  PAGE_MANIPULATION_OVERLAY: 'pageManipulationOverlay',
  PAGE_MANIPULATION_OVERLAY_BUTTON: 'pageManipulationOverlayButton',
  TOOLS_OVERLAY: 'toolsOverlay',
  STAMP_OVERLAY: 'stampOverlay',
  SIGNATURE_OVERLAY: 'signatureOverlay',
  REDACTION_OVERLAY: 'redactionOverlay',
  ANNOTATION_CONTENT_OVERLAY: 'annotationContentOverlay',
  THUMBNAILS_CONTROL_ROTATE_POPUP: 'thumbnailsControlRotatePopup',
  THUMBNAILS_CONTROL_ROTATE_POPUP_TRIGGER: 'thumbnailsControlRotatePopupTrigger',
  THUMBNAILS_CONTROL_MANIPULATE_POPUP: 'thumbnailsControlManipulatePopup',
  THUMBNAILS_CONTROL_MANIPULATE_POPUP_TRIGGER: 'thumbnailsControlManipulatePopupTrigger',
  THUMBNAILS_CONTROL_MANIPULATE_POPUP_SMALL: 'thumbnailsControlManipulatePopupSmall',
  THUMBNAILS_CONTROL_MANIPULATE_POPUP_SMALL_TRIGGER: 'thumbnailsControlManipulatePopupSmallTrigger',

  // Stamps overlay
  RUBBER_STAMP_TAB_HEADER: 'rubberStampTabHeader',
  STANDARD_STAMPS_PANEL_BUTTON: 'standardStampPanelButton',
  CUSTOM_STAMPS_PANEL_BUTTON: 'customStampPanelButton',
  STANDARD_STAMPS_PANEL: 'standardStampPanel',
  CUSTOM_STAMPS_PANEL: 'customStampPanel',
  CREATE_CUSTOM_STAMP_BUTTON: 'createCustomStampButton',
  DELETE_CUSTOM_STAMP_BUTTON: 'deleteCustomStampButton',

  // Popups
  ANNOTATION_POPUP: 'annotationPopup',
  FORM_FIELD_EDIT_POPUP: 'formFieldEditPopup',
  TEXT_POPUP: 'textPopup',
  CONTEXT_MENU_POPUP: 'contextMenuPopup',
  INLINE_COMMENT_POPUP: 'inlineCommentPopup',
  TOOL_STYLE_POPUP: 'toolStylePopup',
  RICH_TEXT_POPUP: 'richTextPopup',
  AUDIO_PLAYBACK_POPUP: 'audioPlaybackPopup',
  DOCUMENT_CROP_POPUP: 'documentCropPopup',
  SNIPPING_TOOL_POPUP: 'snippingToolPopup',

  // Modals
  PAGE_REDACT_MODAL: 'pageRedactionModal',
  LINK_MODAL: 'linkModal',
  LANGUAGE_MODAL: 'languageModal',
  FILTER_MODAL: 'filterModal',
  CONTENT_EDIT_LINK_MODAL: 'contentEditLinkModal',
  SCALE_MODAL: 'scaleModal',
  INSERT_PAGE_MODAL: 'insertPageModal',
  SETTINGS_MODAL: 'settingsModal',
  SAVE_MODAL: 'saveModal',
  PRINT_MODAL: 'printModal',
  SIGNATURE_MODAL: 'signatureModal',
  SIGNATURE_VALIDATION_MODAL: 'signatureValidationModal',
  ERROR_MODAL: 'errorModal',
  PASSWORD_MODAL: 'passwordModal',
  CUSTOM_STAMP_MODAL: 'customStampModal',
  PAGE_REPLACEMENT_MODAL: 'pageReplacementModal',
  LOADING_MODAL: 'loadingModal',
  PROGRESS_MODAL: 'progressModal',
  WARNING_MODAL: 'warningModal',
  MODEL3D_MODAL: 'Model3DModal',
  COLOR_PICKER_MODAL: 'ColorPickerModal',
  OPEN_FILE_MODAL: 'OpenFileModal',
  CUSTOM_MODAL: 'customModal',
  CREATE_PORTFOLIO_MODAL: 'createPortfolioModal',

  // Filter modal
  ANNOTATION_USER_FILTER_PANEL_BUTTON: 'annotationUserFilterPanelButton',
  ANNOTATION_COLOR_FILTER_PANEL_BUTTON: 'annotationColorFilterPanelButton',
  ANNOTATION_TYPE_FILTER_PANEL_BUTTON: 'annotationTypeFilterPanelButton',
  ANNOTATION_STATUS_FILTER_PANEL_BUTTON: 'annotationStatusFilterPanelButton',

  // Settings modal
  SETTINGS_GENERAL_BUTTON: 'settingsGeneralButton',
  SETTINGS_KEYBOARD_BUTTON: 'settingsKeyboardButton',
  SETTINGS_ADVANCED_BUTTON: 'settingsAdvancedButton',
  SETTINGS_LANGUAGE_SECTION: 'settingsLanguageSection',
  SETTINGS_LANGUAGE_DROPDOWN: 'settingsLanguageDropdown',
  SETTINGS_THEME_SECTION: 'settingsThemeSection',

  // Create portfolio modal
  PORTFOLIO_UPLOAD_FILES_TAB: 'portfolioUploadFilesTab',
  PORTFOLIO_UPLOAD_FOLDER_TAB: 'portfolioUploadFolderTab',
  PORTFOLIO_MODAL_ADD_ITEM_TRIGGER: 'portfolioModalAddItemTrigger',

  // Signature Modal
  SAVED_SIGNATURES_TAB: 'signatureModalSavedSignaturesTab',

  // Notes panel - multi select
  NOTE_MULTI_SELECT_MODE_BUTTON: 'multiSelectModeButton',
  NOTE_MULTI_REPLY_BUTTON: 'multiReplyButton',
  NOTE_MULTI_STATE_BUTTON: 'multiStateButton',
  NOTE_MULTI_STYLE_BUTTON: 'multiStyleButton',
  NOTE_MULTI_GROUP_BUTTON: 'multiGroupButton',
  NOTE_MULTI_UNGROUP_BUTTON: 'multiUngroupButton',
  NOTE_MULTI_DELETE_BUTTON: 'multiDeleteButton',

  // Saved Signatures overlay
  SAVED_SIGNATURES_PANEL_BUTTON: 'savedFullSignaturePanelButton',
  SAVED_INTIALS_PANEL_BUTTON: 'savedInitialsPanelButton',
  SAVED_FULL_SIGNATURES_PANEL: 'savedFullSignaturePanel',
  SAVED_INITIALS_PANEL: 'savedInitialsPanel',

  // MultiViewer Mode (MultiViewer)
  MULTI_VIEWER_SAVE_DOCUMENT_BUTTON: 'multiViewerSaveDocumentButton',

  // Office Editor
  OFFICE_EDITOR_TOOLS_HEADER: 'officeEditorToolsHeader',
  OFFICE_EDITOR_TOOLS_HEADER_INSERT_IMAGE: 'officeEditorToolsHeaderInsertImage',
  OFFICE_EDITOR_FILE_NAME: 'officeEditorFileName',

  // Insert Page Modal tabs
  INSERT_BLANK_PAGE_TAB: 'insertBlankPagePanelButton',
  INSERT_FROM_FILE_TAB: 'insertUploadedPagePanelButton',
  INSERT_BLANK_PAGE_PANEL: 'insertBlankPagePanel',
  INSERT_FROM_FILE_PANEL: 'insertUploadedPagePanel',

  // Toolbar groups/Ribbons
  VIEW_TOOLBAR_GROUP: 'toolbarGroup-View',
  ANNOTATE_TOOLBAR_GROUP: 'toolbarGroup-Annotate',
  SHAPES_TOOLBAR_GROUP: 'toolbarGroup-Shapes',
  REDACT_TOOLBAR_GROUP: 'toolbarGroup-Redact',
  INSERT_TOOLBAR_GROUP: 'toolbarGroup-Insert',
  MEASURE_TOOLBAR_GROUP: 'toolbarGroup-Measure',
  EDIT_TOOLBAR_GROUP: 'toolbarGroup-Edit',
  EDIT_TEXT_TOOLBAR_GROUP: 'toolbarGroup-EditText',
  FILL_AND_SIGN_TOOLBAR_GROUP: 'toolbarGroup-FillAndSign',
  FORMS_TOOLBAR_GROUP: 'toolbarGroup-Forms',

  TOOLBAR_GROUPS: [],

  // Menu overlay items
  CREATE_PORTFOLIO_BUTTON: 'createPortfolioButton',

  // Print modal
  PRINT_QUALITY: 'printQuality',
  PRINT_WATERMARK: 'printWatermark',
};

DataElements.TOOLBAR_GROUPS = [
  DataElements.VIEW_TOOLBAR_GROUP,
  DataElements.ANNOTATE_TOOLBAR_GROUP,
  DataElements.SHAPES_TOOLBAR_GROUP,
  DataElements.REDACT_TOOLBAR_GROUP,
  DataElements.INSERT_TOOLBAR_GROUP,
  DataElements.MEASURE_TOOLBAR_GROUP,
  DataElements.EDIT_TOOLBAR_GROUP,
  DataElements.EDIT_TEXT_TOOLBAR_GROUP,
  DataElements.FILL_AND_SIGN_TOOLBAR_GROUP,
  DataElements.FORMS_TOOLBAR_GROUP,
];

export default DataElements;
