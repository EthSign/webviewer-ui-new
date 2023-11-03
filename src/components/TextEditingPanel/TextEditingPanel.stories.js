import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import TextEditingPanel from './TextEditingPanel';
import RightPanel from 'components/RightPanel';
<<<<<<< HEAD
import core from 'core';
=======
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import App from 'components/App';
>>>>>>> 10.5

const noop = () => { };

export default {
  title: 'Components/TextEditingPanel',
  component: TextEditingPanel,
<<<<<<< HEAD
  includeStories: ['Basic', 'TextEditingUndoRedo'],
};

core.getContentEditManager = () => ({
  isInContentEditMode: () => true,
});

const initialState = {
  viewer: {
    isInDesktopOnlyMode: true,
    disabledElements: {
      logoBar: { disabled: true },
    },
    customElementOverrides: {},
=======
  includeStories: ['Basic', 'TextEditingUndoRedo', 'LeftSide'],
};

const textEditingPanelInitialState = {
  ...initialState,
  viewer: {
    ...initialState.viewer,
>>>>>>> 10.5
    openElements: {
      header: true,
      textEditingPanel: true,
    },
<<<<<<< HEAD
    currentLanguage: 'en',
    panelWidths: {
      textEditingPanel: 330,
    },
    modularHeaders: [],
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40
    },
  },
  featureFlags: {
    modularHeader: false,
  },
};

function rootReducer(state = initialState, action) {
=======
    panelWidths: {
      textEditingPanel: 330,
    },

  },
  featureFlags: {
    customizableUI: false,
  },
};

function rootReducer(state = textEditingPanelInitialState) {
>>>>>>> 10.5
  return state;
}

const store = createStore(rootReducer);

const basicProps = {
  currentWidth: 330,
  opacity: 100,
  format: {
    bold: false,
    italic: false,
    underline: false,
  },
  handlePropertyChange: noop,
  handleTextFormatChange: noop,
  textEditProperties: {},
  handleColorChange: noop,
};

export const TextEditingPanelStoryWrapper = ({ children }) => {
  return (
    <Provider store={store}>
      <RightPanel dataElement="textEditingPanel" onResize={noop}>
        {children}
      </RightPanel>
    </Provider>
  );
};

export const Basic = () => {
  return (
    <TextEditingPanelStoryWrapper>
      <div className="Panel TextEditingPanel" style={{ width: '330px', minWidth: '330px' }}>
        <TextEditingPanel {...basicProps} />
      </div>
    </TextEditingPanelStoryWrapper>
  );
};

export const TextEditingUndoRedo = () => {
  const undoRedoProps = {
    currentWidth: 330,
    opacity: 100,
    format: {
      bold: false,
      italic: false,
      underline: false,
    },
    handlePropertyChange: noop,
    handleTextFormatChange: noop,
    textEditProperties: {},
    handleColorChange: noop,
    undoRedoProperties: {
      canUndo: true,
      canRedo: true
    },
  };

  return (
    <TextEditingPanelStoryWrapper>
      <div className="Panel TextEditingPanel" style={{ width: '330px', minWidth: '330px' }}>
        <TextEditingPanel {...undoRedoProps} />
      </div>
    </TextEditingPanelStoryWrapper>
  );
};
<<<<<<< HEAD
=======

const MockApp = ({ initialState }) => {
  return (
    <Provider store={configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
    })}>
      <App removeEventHandlers={noop} />
    </Provider>
  );
};

export const LeftSide = () => {
  const stateTextEditingPanelOnLeft = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      isInDesktopOnlyMode: true,
      customFlxPanels: [
        {
          dataElement: 'panel1',
          render: 'textEditingPanel',
          location: 'left',
        }
      ],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        panel1: true,
      }
    },
  };
  return <MockApp initialState={stateTextEditingPanelOnLeft} />;
};
>>>>>>> 10.5
