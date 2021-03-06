import React, {PropTypes} from 'react';
import Reflux from 'reflux';
import {Button, DropdownButton, MenuItem, Input} from 'react-bootstrap';

import BootstrapModalForm from 'components/bootstrap/BootstrapModalForm';

import SavedSearchesStore from 'stores/search/SavedSearchesStore';
import SavedSearchesActions from 'actions/search/SavedSearchesActions';

const SavedSearchControls = React.createClass({
  propTypes: {
    currentSavedSearch: PropTypes.string,
  },
  mixins: [Reflux.listenTo(SavedSearchesStore, '_updateTitle')],
  getInitialState() {
    return {
      title: '',
      error: false,
    };
  },
  componentDidMount() {
    this._updateTitle();
  },
  _isSearchSaved() {
    return this.props.currentSavedSearch !== undefined;
  },
  _updateTitle() {
    if (!this._isSearchSaved()) {
      return;
    }

    const currentSavedSearch = SavedSearchesStore.getSavedSearch(this.props.currentSavedSearch);
    if (currentSavedSearch !== undefined) {
      this.setState({title: currentSavedSearch.title});
    }
  },
  _openModal() {
    this.refs.saveSearchModal.open();
  },
  _hide() {
    this.refs.saveSearchModal.close();
  },
  _save() {
    if (this.state.error) {
      return;
    }

    let promise;
    if (this._isSearchSaved()) {
      promise = SavedSearchesActions.update.triggerPromise(this.props.currentSavedSearch, this.refs.title.getValue());
    } else {
      promise = SavedSearchesActions.create.triggerPromise(this.refs.title.getValue());
    }
    promise.then(() => this._hide());
  },
  _deleteSavedSearch(event) {
    event.preventDefault();
    if (window.confirm('Do you really want to delete this saved search?')) {
      SavedSearchesActions.delete.triggerPromise(this.props.currentSavedSearch);
    }
  },
  _titleChanged() {
    this.setState({error: !SavedSearchesStore.isValidTitle(this.props.currentSavedSearch, this.refs.title.getValue())});
  },
  _getNewSavedSearchButtons() {
    return <Button bsStyle="success" bsSize="small" onClick={this._openModal}>Save search criteria</Button>;
  },
  _getEditSavedSearchControls() {
    return (
      <DropdownButton bsSize="small" title="Saved search" id="saved-search-actions-dropdown">
        <MenuItem onSelect={this._openModal}>Update search criteria</MenuItem>
        <MenuItem divider/>
        <MenuItem onSelect={this._deleteSavedSearch}>Delete saved search</MenuItem>
      </DropdownButton>
    );
  },
  render() {
    return (
      <div style={{display: 'inline-block'}}>
        {this._isSearchSaved() ? this._getEditSavedSearchControls() : this._getNewSavedSearchButtons()}
        <BootstrapModalForm ref="saveSearchModal"
                            title={this._isSearchSaved() ? 'Update saved search' : 'Save search criteria'}
                            onSubmitForm={this._save}
                            submitButtonText="Save">
          <Input type="text"
                 label="Title"
                 ref="title"
                 required
                 defaultValue={this.state.title}
                 onChange={this._titleChanged}
                 bsStyle={this.state.error ? 'error' : null}
                 help={this.state.error ? 'Title was already taken.' : 'Type a name describing the current search.'}
                 autoFocus/>
        </BootstrapModalForm>
      </div>
    );
  },
});

export default SavedSearchControls;
