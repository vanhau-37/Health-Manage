import React, { Component } from "react";
import AsyncSelect from "react-select/async";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../../../utils/emitter";
import {
    changeImageApi,
    searchSymptomApi,
} from "../../../../services/diseaseService";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ModalDisease extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            image: "",
            description: "",
            markdownContent:"",
            chooseOptions: [],
            errChangeImage: "",
            listSymptom: [],
            isOpen: false,
        };
        this.listenToEmitter();
    }

    listenToEmitter() {
        emitter.on("EVENT_CLEAR_MODAL_DATA", () => {
            this.setState({
                name: "",
                image: "",
                description: "",
                chooseOptions: [],
            });
        });
    }

    componentDidMount() {}

    toggle = () => {
        this.props.toggleDiseaseModal();
    };

    handleOnChangeInput = (ev, id) => {
        let copyState = { ...this.state };
        copyState[id] = ev.target.value;
        this.setState({
            ...copyState,
        });
    };

    handleChangeImage = async (ev) => {
        this.setState({
            errChangeImage: "",
        });
        try {
            let formData = new FormData();
            formData.append("imgFile", ev.target.files[0]);
            let res = await changeImageApi(formData);
            if (res && res.status) {
                this.setState({
                    image: res.data,
                });
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                this.setState({
                    errChangeImage: error.response.data?.message || "",
                });
            }
        }
    };

    handlOpen = () => {
        if (!this.state.image) return;
        this.setState({
            isOpen: true,
        });
    };

    handleAddDisease = () => {
        let { name, image, listSymptom, description, markdownContent } = this.state;
        let data = {
            name,
            image,
            listSymptom,
            description,
            markdownContent,
        };
        this.props.createDisease(data);
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
            chooseOptions: data || [],
            listSymptom: listId,
        });
    };

    handleEditorChange = ({ html, text }) => {
        this.setState({
            description: text,
            markdownContent: html,
        })
    }

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => {
                    this.toggle();
                }}
                className={"modal-disease-container"}
                size="lg"
            >
                <ModalHeader
                    toggle={() => {
                        this.toggle();
                    }}
                >
                    Thêm Bệnh
                </ModalHeader>
                <ModalBody>
                    <div className="modal-disease-body">
                        <div className="input-container max-width-input">
                            <label>Tên bệnh</label>
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
                        <div className="input-container max-width-input add-height">
                            <div className="input-content">
                                <div className="lable-image">Hình ảnh</div>
                                <div
                                    className="preview-image"
                                    style={{
                                        backgroundImage: `url(${this.state.image})`,
                                    }}
                                    onClick={this.handlOpen}
                                ></div>
                                {(
                                    <div className="err-message">
                                        {this.props.listError.image || ""}
                                    </div>
                                ) || (
                                    <div className="err-message image">
                                        {this.state.errChangeImage || ""}
                                    </div>
                                )}
                            </div>
                            <div className="input-image">
                                <input
                                    type="file"
                                    id="previewImg"
                                    hidden
                                    onChange={(ev) => {
                                        this.handleChangeImage(ev);
                                    }}
                                />
                                <label
                                    htmlFor="previewImg"
                                    className="lable-upload"
                                >
                                    Tải ảnh{" "}
                                    <i className="fa-solid fa-upload"></i>
                                </label>
                            </div>
                        </div>
                        <div className="input-container max-width-input">
                            <label>Triệu chứng bệnh</label>
                            <AsyncSelect
                                cacheOption
                                defaultOptions
                                isMulti
                                value={this.state.chooseOptions}
                                loadOptions={this.loadOptions}
                                onChange={this.multiSelectChange}
                            />
                            <div className="err-message">
                                {this.props.listError.listSymptom || ""}
                            </div>
                        </div>

                        <div className="input-container max-width-input">
                            <label>Thông tin bệnh</label>
                            <div >
                                <MdEditor
                                    style={{ height: "300px" }}
                                    renderHTML={(text) => mdParser.render(text)}
                                    onChange={this.handleEditorChange}
                                    value= {this.state.description}
                                />
                            </div>
                            <div className="err-message">
                                {this.props.listError.description || ""}
                            </div>
                        </div>
                        {this.state.isOpen === true && (
                            <Lightbox
                                mainSrc={this.state.image}
                                onCloseRequest={() =>
                                    this.setState({ isOpen: false })
                                }
                            />
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        className="px-3"
                        onClick={() => {
                            this.handleAddDisease();
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalDisease);
