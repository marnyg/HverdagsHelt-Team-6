//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import CategoryService from "../../../../services/CategoryService";
import ToolService from "../../../../services/ToolService";
import StatusService from "../../../../services/StatusService";

class DeleteCategory extends Component {
    error = null;
    render() {
        return(
            <div key={this.props.category.category_id}>
                {this.error}
                Er du sikker på at du vil slette statusen <strong>{this.props.category.name}</strong>?
                <div className={'mt-3'}>
                    <button onClick={() => {
                        let categoryService = new CategoryService();
                        categoryService.deleteCategory(this.props.category.category_id)
                            .then(res => {
                                $('#verify-modal').modal('hide');
                                this.props.onDelete();
                            })
                            .catch((error: Error) => {
                                this.error = ToolService.getCategoryDeleteErrorAlert(error, () => {
                                    this.error = null;
                                });
                            })
                    }}
                            className={'btn btn-danger'}>Ja</button>
                    <button onClick={(event) => {}} type="button" className="btn btn-primary float-right" data-dismiss="modal">Avbryt</button>
                </div>
            </div>
        );
    }

    componentWillReceiveProps(newProps) {
        if(newProps.category !== this.props.category) {
            this.setState({
                category: newProps.category
            });
        }
    }
}
export default DeleteCategory;