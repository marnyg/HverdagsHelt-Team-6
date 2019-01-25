//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import StatusList from "./Statuses/StatusList";
import CategoryList from "./Categories/CategoryList";

class StatusCategoryRegistration extends Component{
    render() {
        return(
            <div className={'container'}>
                <div className={'row'}>
                    <div className={'col'}>
                        <StatusList/>
                    </div>
                    <div className={'col'}>
                        <CategoryList/>
                    </div>
                </div>
            </div>
        );
    }
}
export default StatusCategoryRegistration;