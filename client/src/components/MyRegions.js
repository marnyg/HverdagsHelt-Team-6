
// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';

class MyProfile extends Component<{}, { isEditing: boolean }> {
    // state = { isEditing: false };
    reagion = [];
    county = [];
    subscribedCountis = [];

    user = null
    render() {
        return <div>
            {this.getListEllement("Dine Komuner", this.subscribedCountis, <button onClick={this.handleDelete}>remove</button>)}
            {this.getFilterListEllement("Fylker", this.reagion)}
            {this.getListEllement("Komuner", this.county, <button onClick={this.handleAdd}>add</button>)}
        </div>

    }
    getListEllement(headline: string, listItems: Array<{ name: string, id: number }>, button) {
        return <div>
            {headline}
            <ul>
                {listItems.map(e => {
                    return <li id={e.id}>{e.name} {button}</li>
                })}
            </ul>
        </div>
    }
    getFilterListEllement(headline: string, listItems: Array<{ name: string, id: number }>) {
        return <div>
            {headline}
            < ul >
                {
                    listItems.map(e => {
                        return <li id={e.id} onClick={this.filterKomuner}>{e.name}</li>
                    })
                }
            </ul >
        </div >
    }
    filterKomuner(e) {
        let all = Array.prototype.slice.call(e.target.parentNode.children, 0);
        console.log(all.map(e => e.removeAttribute("class", "bg-dark")));
        e.target.setAttribute("class", "bg-dark")
        console.log("finltering on region with id " + e.target.id);


    }
    handleDelete(e) {
        console.log(e);
        console.log("delete " + e.target.parentNode.id);
    }

    handleAdd(e) {
        console.log(e);
        console.log("add " + e.target.parentNode.id);
    }
    mounted() {
        this.county = [{ name: "aa", id: 1 }, { name: "ba", id: 2 }, { name: "ab", id: 3 }, { name: "bb", id: 4 },]
        this.subscribedCountis = [{ name: "aa", id: 1 }, { name: "bc", id: 4 }];
        this.reagion = [{ name: "a", id: 1 }, { name: "b", id: 2 }];
    }
}

export default MyProfile
