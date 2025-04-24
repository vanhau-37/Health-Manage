import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../../../utils/emitter";

class ModalSymptom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
        };
        this.listenToEmitter();
    }

    listenToEmitter() {
        emitter.on("EVENT_CLEAR_MODAL_DATA", () => {
            this.setState({
                name: "",
                description: "",
            });
        });
    }

    componentDidMount() {}

    toggle = () => {
        this.props.toggleSymptomModal();
    };

    handleOnChangeInput = (ev, id) => {
        let copyState = { ...this.state };
        copyState[id] = ev.target.value;
        this.setState({
            ...copyState,
        });
    };

    handleAddSymptom = () => {
        this.props.createSymptom(this.state);
    };

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => {
                    this.toggle();
                }}
                className={"modal-user-container"}
                size="lg"
            >
                <ModalHeader
                    toggle={() => {
                        this.toggle();
                    }}
                >
                    Thêm Triệu Chứng
                </ModalHeader>
                <ModalBody>
                    <div className="modal-user-body">
                        <div className="input-container max-width-input">
                            <label>Tên triệu chứng</label>
                            <input
                                type="text"
                                onChange={(ev) => {
                                    this.handleOnChangeInput(ev, "name");
                                }}
                                value={this.state.name}
                            />
                            <div className="err-message">
                                {this.props.listError.name || ""}
                            </div>
                        </div>
                        <div className="input-container max-width-input">
                            <label>Mô tả triệu chứng</label>
                            <textarea
                                type="text"
                                onChange={(ev) => {
                                    this.handleOnChangeInput(ev, "description");
                                }}
                                value={this.state.description}
                            />
                            <div className="err-message">
                                {this.props.listError.description || ""}
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        className="px-3"
                        onClick={() => {
                            this.handleAddSymptom();
                        }}
                    >
                        Thêm
                    </Button>{" "}
                    <Button
                        color="secondary"
                        className="px-3"
                        onClick={() => {
                            this.toggle();
                        }}
                    >
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalSymptom);
