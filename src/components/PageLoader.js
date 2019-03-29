import React, { Component } from 'react';

class PageLoader extends Component {

	constructor(props){
		super(props);
        this.state = {isOpen:true}
		this.state = {pageLoadedDelay: false}
		this.state = {pageLoaded: false};
	}

	render(){

		if(this.props.loadDelay){
			return null;
		}
		else{

		    if(!this.props.updateData) {
                return (
                    <div className="pageload-bg">
                        <div className="preload-box" id="preload-box">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span className="status">Загрузка</span>
                        </div>
                    </div>
                )
            }else{
                return (
                    <div className="pageload-bg">
                        <div className="preload-box" id="preload-box">
                            <span className="status">Готово</span>
                        </div>
                    </div>
                )
            }

		}

	}

}

export default PageLoader
