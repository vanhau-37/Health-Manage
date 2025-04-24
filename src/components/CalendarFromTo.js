import React, { Component } from "react";
import "./CalendarFromTo.scss"

class CalendarFromTo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            from:"",
            to:"",
        }
    }

    handOnChange = (ev, key) => {
        let copyState = { ...this.state }
        copyState[key] = ev.target.value;
        this.setState({
            ...copyState
        }, () => this.props.updateFromTo(this.state.from, this.state.to))
    }

    render() {
        return (
            <>
                <div className="calender-container">
                    <div className="calender-content">
                        <div className="calender-from">
                            <label>Từ:</label>{" "}
                            <input
                                type="date"
                                onChange={(ev) => this.handOnChange(ev, "from")}
                            ></input>
                        </div>
                        <div className="calender-to">
                            <label>Đến:</label>{" "}
                            <input
                                type="date"
                                onChange={(ev) => this.handOnChange(ev, "to")}
                            ></input>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default CalendarFromTo;