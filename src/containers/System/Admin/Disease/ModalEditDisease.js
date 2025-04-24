import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import _ from "lodash";
import AsyncSelect from "react-select/async";
import Lightbox from "react-image-lightbox";
import {
    changeImageApi,
    searchSymptomApi,
} from "../../../../services/diseaseService";
// import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ModalEditDisease extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            name: "",
            image: "",
            description: "",
            markdownContent: "",
            chooseOptions: [],
            errChangeImage: "",
            listSymptom: [],
            isOpen: false,
        };
    }

    componentDidMount() {
        let data = this.props.editDisease;
        if (data && !_.isEmpty(data)) {
            let choose = data.listSymptom.map((x) => {
                return { value: x.id, label: x.name };
            });
            let arrIdSymptom = data.listSymptom.map((x) => {
                return x.id;
            });
            this.setState({
                id: data.id,
                name: data.name,
                image: data.image,
                description: data.description,
                markdownContent: data.markdownContent,
                chooseOptions: choose,
                listSymptom: arrIdSymptom,
            });
        }
    }

    toggle = () => {
        this.props.toggleDiseaseEditModal();
    };

    handlOpen = () => {
        if (!this.state.image) return;
        this.setState({
            isOpen: true,
        });
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

    handleOnChangeInput = (ev, id) => {
        let copyState = { ...this.state };
        copyState[id] = ev.target.value;
        this.setState({
            ...copyState,
        });
    };

    handleChangeImage = async (ev, oldUrl) => {
        this.setState({
            errChangeImage: "",
        });
        try {
            let formData = new FormData();
            formData.append("imgFile", ev.target.files[0]);
            formData.append("oldImageUrl", oldUrl || "");
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

    handlEditDisease = () => {
        this.props.doEditDisease(this.state);
    };

    handleEditorChange = ({ html, text }) => {
        this.setState({
            description: text,
            markdownContent: html,
        });
    };

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
                    Sửa Thông Tin Bệnh
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
                                        this.handleChangeImage(
                                            ev,
                                            this.state.image
                                        );
                                    }}
                                    // value={this.state.image}
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
                            <div>
                                <MdEditor
                                    style={{ height: "300px" }}
                                    renderHTML={(text) => mdParser.render(text)}
                                    onChange={this.handleEditorChange}
                                    value={this.state.description}
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
                            this.handlEditDisease();
                        }}
                    >
                        Cập nhật
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditDisease);
