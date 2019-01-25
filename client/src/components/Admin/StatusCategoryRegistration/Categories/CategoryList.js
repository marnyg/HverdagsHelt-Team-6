//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEdit, faPlus, faTrashAlt} from "@fortawesome/free-solid-svg-icons/index";
import CategoryService from "../../../../services/CategoryService";
import VerificationModal from "../../../VerificationModal";
import ToolService from "../../../../services/ToolService";
import EditCategoryForm from "./EditCategoryForm";
import DeleteCategory from "./DeleteCategory";
import AddCategoryForm from "./AddCategoryForm";

class CategoryList extends Component{
    categories = [];
    delete_error = null;
    edit_error = null;

    render() {
        return(
            <div>
                <div className={'card mb-3'}>
                    <h3 className={'text-center w-100'}>Registrer ny kategori</h3>
                    <button onClick={(event) => this.addCategory()}
                            className={'btn btn-primary'} type="button" data-toggle="modal"
                            data-target="#verify-modal">
                        <FontAwesomeIcon icon={faPlus}/>
                    </button>
                </div>
                <div className={'card mb-3'} style={{'overflow':'scroll','maxHeight': '700px'}}>
                    <table className={'table table-hover table-striped'}>
                        <thead>
                        <tr>
                            <th scope="col">Kategori ID</th>
                            <th scope="col">Navn</th>
                            <th scope="col">Rediger</th>
                            <th scope="col">Slett</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.categories.map(category => {
                            return(
                                <tr key={category.category_id} style={{ cursor: 'pointer' }}>
                                    <td>{category.category_id}</td>
                                    <td>{category.name}</td>
                                    <td onClick={(event) => this.editCategory(category)}>
                                        <button className={'btn btn-primary'} type="button" data-toggle="modal"
                                                data-target="#verify-modal">
                                            <FontAwesomeIcon icon={faEdit}/>
                                        </button>
                                    </td>
                                    <td onClick={(event) => this.deleteCategory(category)}>
                                        <button className={'btn btn-danger'} type="button" data-toggle="modal"
                                                data-target="#verify-modal">
                                            <FontAwesomeIcon icon={faTrashAlt}/>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    mounted() {
        $('#spinner').hide();
        this.fetch_categories();
    }

    fetch_categories() {
        let categoryService = new CategoryService();
        categoryService.getAllCategories()
            .then((categories: Category[]) => {
                this.categories = categories;
            })
            .catch((error: Error) => {
                console.error(error);
            });
    }

    editCategory(category) {
        let modal_header = 'Er du sikker?';
        let modal_body = (
            <EditCategoryForm category={category} onChange={(newcategory) => {
                this.fetch_categories();
            }}/>
        );
        let modal_footer = null;
        VerificationModal.setcontent(modal_header, modal_body, modal_footer);
    }

    deleteCategory(category) {
        let modal_header = 'Er du sikker?';
        let modal_body = (
            <DeleteCategory category={category} onDelete={() => {
                this.fetch_categories();
            }}/>
        );
        let modal_footer = null;
        VerificationModal.setcontent(modal_header, modal_body, modal_footer);
    }

    addCategory() {
        let modal_header = 'Skriv inn navnet til en ny status!';
        let modal_body = (
            <AddCategoryForm onCreate={(newcategory) => {
                this.fetch_categories();
            }}/>
        );
        let modal_footer = null;
        VerificationModal.setcontent(modal_header, modal_body, modal_footer);
    }
}
export default CategoryList;