import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';

//import PictureService from '../services/PictureService.js'; REMOVE COMMENTS WHEN SERVICES DONE
//import Picture from '../classes/Picture.js'; REMOVE COMMENTS WHEN CLASSES DONE

class CaseItem extends Component {
    constructor(){
        super();
        this.images = [];
    }

    render() {
        return (
            <div key={this.props.case.case_id} className="item">
                <NavLink to={"/case/" + this.props.case.case_id} className="preview">
                    {this.images.length > 0 ?
                        <div className="thumb"
                             style={{backgroundImage: "url(" + this.images[0].path + ")"}}
                        />
                        :
                        <div className="thumb"
                             style={{backgroundImage: "url(/no-image.png)"}}
                        />
                    }
                    <article>
                        <div>{this.props.case.region}</div>
                        <h2>{this.props.case.title}</h2>
                    </article>
                    <div>{this.props.case.date}</div>
                </NavLink>
            </div>
        );
    }

    mounted(){
        this.images = [
            {path: 'https://res.cloudinary.com/simpleview/image/upload/v1504558184/clients/norway/6d185cb5_1903_43a6_bd2b_9771c44d25bc_3c270880-a51d-4199-a673-021a21c8d2a9.jpg'}
        ];
        //console.log(this.images.length);
        /* REMOVE COMMENTS WHEN SERVICES DONE
        let pictureService = new PictureService();

        pictureService.get(this.props.case.case_id)
            .then((pictures: Picture[]) => {
                this.pictures = pictures;
            })
            .catch((error: Error) => console.error(error));
        */
    }
}
export default CaseItem;

