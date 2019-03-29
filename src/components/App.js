import React, { Component } from 'react';
import Canvas from './Canvas';
import PageLoader from './PageLoader';

class App extends Component{

	constructor(props){
		super(props);
		this.updateData = this.updateData.bind(this);
        this.loadDelay = this.loadDelay.bind(this);
        this.state = {pageLoaded: false};
        this.state = {pageLoadedDelay: false};
		this.state = {isLoad: false};
        this.state = {isLoadDelay: false};
	}

	updateData(value){
		this.setState({ pageLoaded: value })
		this.setState({ isLoad: value })
	}

	loadDelay(value){
        this.setState({ pageLoadedDelay: value })
        this.setState({ isLoadDelay: value })
    }

	render() {

			return (
				<>
					<PageLoader updateData={this.state.isLoad} loadDelay={this.state.isLoadDelay}/>
					<div className="wrapper">
						<Canvas updateData={this.updateData} loadDelay={this.loadDelay}/>
					</div>
				</>
			);


	}

}

export default App;