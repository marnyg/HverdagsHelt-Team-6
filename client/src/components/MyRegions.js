
// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';

class MyProfile extends Component<{}, { isEditing: boolean }> {
    // state = { isEditing: false };
    fylke = [];
    komuner = [];
    mineKomuner = [];

    user = null
    render() {
        <div>
            {this.getMyRegionsDiv())}
            {this.getAllregionsDiv())}
            {this.getMyRegionsDiv())}
        </div>

    }
    getMyRegionsDiv() {

    }

    mounted() {
        this.mineKomuner = [{ name: "aa", id: 1 }, { name: "ba", id: 2 }, { name: "ab", id: 3 }, { name: "ac", id: 4 },]
        this.komuner = { name: 'Ola Norman', epost: '123@asd.abc', tlf: '12312312', password: "1" };
        this.fylke = [{ name: "a", id: 1 }, { name: "b", id: 2 }];
    }
}
