//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import ToolService from "../../../../services/ToolService";
import CategoryService from "../../../../services/CategoryService";

class EditCategoryForm extends Component{
    error = null;
    category = null;
    render() {
        return(
            <div key={this.props.category.category_id}>
                {this.error}
                <form ref={'editCategoryForm'} className={'form-group'}>
                    <label htmlFor={'edit-category-form-name'}>Kategorinavn:</label>
                    <br/>
                    <small className={'text-muted'}>Kun bokstaver og mellomrom, ingen tall eller spesialtegn.</small>
                    <input id={'edit-category-form-name'}
                           className={'form-control'}
                           type={'text'}
                           name={'edit-category-form-name'}
                           defaultValue={this.props.category.name}
                           pattern={'^[a-zA-ZæøåÆØÅ\\-\\s]+'}
                           required
                    />
                    <div className={'mt-3'}>
                        <button className={'btn btn-primary'}
                                onClick={(event) => this.editCategory(event)}>Lagre endringer</button>
                        <button className={'btn btn-danger float-right'} type="button"
                                data-dismiss="modal" onClick={(event) => event.preventDefault()}>Avbryt</button>
                    </div>
                </form>
            </div>
        );
    }

    editCategory(event) {
        event.preventDefault();
        let form = this.refs.editCategoryForm;

        if(form.checkValidity()){
            let newcategory = {
                category_id: Number(this.props.category.category_id),
                name: document.querySelector('#edit-category-form-name').value
            };
            console.log(newcategory);
            let categoryService = new CategoryService();
            categoryService.updateCategory(newcategory.category_id, newcategory)
                .then(res => {
                    $('#verify-modal').modal('hide');
                    this.props.onChange(newcategory);
                })
                .catch((error: Error) => {
                    this.error = ToolService.getCategoryDeleteErrorAlert(error, () => {
                        this.error = null;
                    });
                });
        } else {
            form.reportValidity();
        }
    }

    componentWillReceiveProps(newProps) {
        if(newProps.category !== this.props.category) {
            this.setState({
                category: newProps.category
            });
        }
    }
}
export default EditCategoryForm;