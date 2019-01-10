import * as React from 'react';
import { Component } from 'react-simplified';
//import PictureService from '../services/PictureService.js'; REMOVE COMMENTS WHEN SERVICES DONE
//import Picture from '../classes/Picture.js'; REMOVE COMMENTS WHEN CLASSES DONE

class CaseItem extends Component {
    render() {
        return (
            <div className="item">
                <a href="#" className="preview">
                    {this.images.length > 0 ?
                        <div className="thumb"
                             style={{backgroundImage: "url(/no-image.png)"}}
                        />
                        :
                        <div className="thumb"
                             style={{backgroundImage: "url(" + this.images[0].path + ")"}}
                        />
                    }
                    <article>
                        <div className="priority_tag">{this.props.case.region}</div>
                        <h2>{this.props.case.title}</h2>
                    </article>
                    <div className="preview_date">{this.props.case.date}</div>
                </a>
            </div>
        );
    }

    mounted(){
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

