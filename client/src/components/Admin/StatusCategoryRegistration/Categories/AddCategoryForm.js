//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import StatusService from "../../../../services/StatusService";
import ToolService from "../../../../services/ToolService";
import CategoryService from "../../../../services/CategoryService";

class AddCategoryForm extends Component{
    error = null;
    render() {
        return(
            <div>
                {this.error}
                <div className={'mt-3'}>
                    <form ref={'addCategoryForm'} className={'form-group'}>
                        <label htmlFor={'add-category-name'}>Kategorinavn:</label>
                        <br/>
                        <small className={'text-muted'}>Kun bokstaver og mellomrom, ingen tall eller spesialtegn.</small>
                        <input
                            id={'add-category-name'}
                            className={'form-control'}
                            type={'text'}
                            name={'add-category-name'}
                            placeholder={'Kategorinavn'}
                            pattern={'^[a-zA-ZæøåÆØÅ\\-\\s]+'}
                            required
                        />
                        <div className={'mt-3'}>
                            <button className={'btn btn-danger'} onClick={(event) => this.submit(event)}>Registrer kategori</button>
                            <button onClick={(event) => {}} type="button" className="btn btn-primary float-right" data-dismiss="modal">Avbryt</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    submit(event) {
        event.preventDefault();
        let form = this.refs.addCategoryForm;
        if(form.checkValidity()) {
            let newcategory = {
                category_id: null,
                name: document.querySelector('#add-category-name').value
            };
            let categoryService = new CategoryService();
            categoryService.createCategory(newcategory)
                .then(res => {
                    $('#verify-modal').modal('hide');
                    this.props.onCreate(newcategory);
                })
                .catch((error: Error) => {
                    this.error = ToolService.getCreateCategoryErrorAlert(error, () => this.error = null);
                })
        } else {
            form.reportValidity();
        }
    }
}
export default AddCategoryForm;