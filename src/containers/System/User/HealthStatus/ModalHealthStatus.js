import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../../../utils/emitter";
import AsyncSelect from "react-select/async";
import {
    searchSymptomApi,
} from "../../../../services/diseaseService";

class ModalHealthStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weight: 0,
            height: 0,
            temperature: 0,
            status: [],
            listIdStatus: [],
        };
        this.listenToEmitter();
    }

    listenToEmitter() {
        emitter.on("EVENT_CLEAR_MODAL_DATA", () => {
            this.setState({
                weight: 0,
                height: 0,
                temperature: 0,
                status: [],
                listIdStatus:[],
            });
        });
    }

    componentDidMount() {}

    toggle = () => {
        this.setState({
            weight: 0,
            height: 0,
            temperature: 0,
            status: [],
            listIdStatus: [],
        });
        this.props.toggleHealthStatusModal("isOpenModalHealthStatus");
    };

    handleOnChangeInput = (ev, id) => {
        let copyState = { ...this.state };
        copyState[id] =
            id === "status"
                ? ev.target.value
                : parseFloat(ev.target.value) || 0;
        this.setState({
            ...copyState,
        });
    };

    handleAddHealthStatus = () => {
        this.props.createHealthStatus(this.state);
    };

    loadOptions = async (inputValue) => {
        let res = await searchSymptomApi(inputValue);
        if (res.status) {
            return res.data.map((item) => ({
                value: item.id,
                label: item.name,
            }));
        }
    };

    multiSelectChange = (data) => {
        let listId = data.map((x) => {
            return x.value;
        });

        this.setState({
            status: data || [],
            listIdStatus: listId,
        });
    };

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => {
                    this.toggle();
                }}
                className={"modal-health-status-container"}
                size="lg"
            >
                <ModalHeader
                    toggle={() => {
                        this.toggle();
                    }}
                >
                    Thêm tình trạng sức khỏe
                </ModalHeader>
                <ModalBody>
                    <div className="modal-health-status-body">
                        <div className="input-container">
                            <label>Cân nặng(kg)</label>
                            <input
                                type="number"
                                step="0.1"
                                onChange={(ev) => {
                                    this.handleOnChangeInput(ev, "weight");
                                }}
                                // value={this.state.weight}
                            />
                            <div className="err-message">
                                {this.props.listError.weight || ""}
                            </div>
                        </div>
                        <div className="input-container">
                            <label>Chiều cao(m)</label>
                            <input
                                type="number"
                                step="0.01"
                                onChange={(ev) => {
                                    this.handleOnChangeInput(ev, "height");
                                }}
                                // value={this.state.height}
                            />
                            <div className="err-message">
                                {this.props.listError.height || ""}
                            </div>
                        </div>
                        <div className="input-container max-width-input">
                            <label>Nhiệt độ(℃)</label>
                            <input
                                type="number"
                                step="0.1"
                                onChange={(ev) => {
                                    this.handleOnChangeInput(ev, "temperature");
                                }}
                                // value={this.state.temperature}
                            />
                            <div className="err-message">
                                {this.props.listError.temperature || ""}
                            </div>
                        </div>
                        <div className="input-container max-width-input add-height-input">
                            <label>Trạng thái cơ thể</label>
                            <AsyncSelect
                                cacheOption
                                defaultOptions
                                isMulti
                                value={this.state.status}
                                loadOptions={this.loadOptions}
                                onChange={this.multiSelectChange}
                            />
                            {/* <textarea
                                className="text-area"
                                onChange={(ev) => {
                                    this.handleOnChangeInput(ev, "status");
                                }}
                                value={this.state.status}
                            ></textarea> */}
                            <div className="error-health-status">
                                <div className="err-message">
                                    {this.props.listError.listIdStatus || ""}
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        className="px-3"
                        onClick={() => {
                            this.handleAddHealthStatus();
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalHealthStatus);
