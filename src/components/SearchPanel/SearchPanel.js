import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import SearchResult from 'components/SearchResult';
import SearchOverlay from 'components/SearchOverlay';
import Icon from 'components/Icon';
import getClassName from 'helpers/getClassName';
import DataElementWrapper from 'components/DataElementWrapper';
import { addSearchListener, removeSearchListener } from 'helpers/search';
import ThumbnailsPanel from 'components/ThumbnailsPanel';

import './SearchPanel.scss';
import useSearch from 'hooks/useSearch';

const propTypes = {
  isOpen: PropTypes.bool,
  isMobile: PropTypes.bool,
  pageLabels: PropTypes.array,
  currentWidth: PropTypes.number,
  closeSearchPanel: PropTypes.func,
  setActiveResult: PropTypes.func,
  isInDesktopOnlyMode: PropTypes.bool,
  isProcessingSearchResults: PropTypes.bool,
  activeDocumentViewerKey: PropTypes.number
};

function noop() { }

function SearchPanel(props) {
  const {
    isOpen,
    currentWidth,
    pageLabels,
    closeSearchPanel = noop,
    setActiveResult = noop,
    setNextResultValue = noop,
    isMobile = false,
    isInDesktopOnlyMode,
    isProcessingSearchResults,
    activeDocumentViewerKey
  } = props;

  const { t } = useTranslation();
  const { searchStatus, searchResults, activeSearchResultIndex, setSearchStatus } = useSearch(activeDocumentViewerKey);

  const onCloseButtonClick = React.useCallback(function onCloseButtonClick() {
    if (closeSearchPanel) {
      closeSearchPanel();
    }
  }, [closeSearchPanel]);

  const onClickResult = React.useCallback(function onClickResult(resultIndex, result, activeDocumentViewerKey) {
    setActiveResult(result, activeDocumentViewerKey);
    if (!isInDesktopOnlyMode && isMobile) {
      closeSearchPanel();
    }

    setNextResultValue(result);
  }, [closeSearchPanel, isInDesktopOnlyMode, isMobile, setActiveResult, setNextResultValue]);

  const [isSearchInProgress, setIsSearchInProgress] = React.useState(false);

  const searchEventListener = () => {
    setIsSearchInProgress(false);
  };

  React.useEffect(() => {
    // componentDidMount
    addSearchListener(searchEventListener);
  }, []);

  React.useEffect(() => {
    // componentWillUnmount
    return () => {
      removeSearchListener(searchEventListener);
    };
  }, []);

  const className = getClassName('Panel SearchPanel', { isOpen });
  const style = !isInDesktopOnlyMode && isMobile ? {} : { width: `${currentWidth}px`, minWidth: `${currentWidth}px` };
  return (
    <DataElementWrapper
      className={className}
      dataElement="searchPanel"
      style={style}
    >
      {!isInDesktopOnlyMode && isMobile &&
        <div
          className="close-container"
        >
          <button
            className="close-icon-container"
            onClick={onCloseButtonClick}
          >
            <Icon
              glyph="ic_close_black_24px"
              className="close-icon"
            />
          </button>
        </div>}
      <SearchOverlay
        searchStatus={searchStatus}
        setSearchStatus={setSearchStatus}
        searchResults={searchResults}
        activeResultIndex={activeSearchResultIndex}
        isPanelOpen={isOpen}
        isSearchInProgress={isSearchInProgress}
        setIsSearchInProgress={setIsSearchInProgress}
        activeDocumentViewerKey={activeDocumentViewerKey}
      />
      <div style={{ display: searchStatus !== 'SEARCH_DONE' ? 'block' : 'none', height: '100%' }}><ThumbnailsPanel></ThumbnailsPanel></div>
      <SearchResult
        t={t}
        searchStatus={searchStatus}
        searchResults={searchResults}
        activeResultIndex={activeSearchResultIndex}
        onClickResult={onClickResult}
        pageLabels={pageLabels}
        isProcessingSearchResults={isProcessingSearchResults}
        isSearchInProgress={isSearchInProgress}
        activeDocumentViewerKey={activeDocumentViewerKey}
      />
    </DataElementWrapper >
  );
}

SearchPanel.propTypes = propTypes;

export default SearchPanel;
