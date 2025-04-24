import React, { Component } from "react";
import { connect } from "react-redux";
import {
    createDiseaseApi,
    getAllDiseaseApi,
    deleteDiseaseApi,
    updateDiseaseApi,
} from "../../../../services/diseaseService";
import { emitter } from "../../../../utils/emitter";
import { toast } from "react-toastify";
import "./DiseaseManage.scss";
import ModalDisease from "./ModalDisease";
import ModalEditDisease from "./ModalEditDisease";
import ReactPaginate from "react-paginate";
import CustomScrollbars from "../../../../components/CustomScrollbars";

class DiseaseManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDiseases: [],
            isOpenModalDisease: false,
            isOpenModalEditDisease: false,
            errMessage: {
                name: "",
                description: "",
                listSymptom: "",
                image: "",
            },
            editDisease: {},
            countDisease: 1,
            pageIndex: 0,
        };
    }

    async componentDidMount() {
        await this.getAllDisease(this.state.pageIndex);
    }

    getAllDisease = async (pageIndex) => {
        try {
            let res = await getAllDiseaseApi("", pageIndex);
            if (res.status) {
                this.setState({
                    arrDiseases: res.data.diseases,
                    countDisease: res.data.totalPage,
                });
            }
        } catch (error) {
            if (!error.response.data.status) {
                toast.error(error.response.data.message);
            }
        }
    };

    toggleDiseaseModal = () => {
        this.setState({
            errMessage: {
                name: "",
                description: "",
                listSymptom: "",
                image: "",
            },
            isOpenModalDisease: !this.state.isOpenModalDisease,
        });
    };

    toggleDiseaseEditModal = () => {
        this.setState({
            errMessage: {
                name: "",
                description: "",
                listSymptom: "",
                image: "",
            },
            isOpenModalEditDisease: !this.state.isOpenModalEditDisease,
        });
    };

    handleAddNewDisease = () => {
        this.setState({ isOpenModalDisease: true });
    };

    createDisease = async (data) => {
        this.setState({
            errMessage: {
                name: "",
                description: "",
                listSymptom: "",
                image: "",
            },
        });
        try {
            await createDiseaseApi(data);
            await this.getAllDisease(this.state.pageIndex);
            this.toggleDiseaseModal();
            toast.success("Thêm thành công");
            emitter.emit("EVENT_CLEAR_MODAL_DATA");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log(error.response.data.errors);
                this.setState({
                    errMessage: {
                        name: error.response.data.errors?.Name?.[0] || "",
                        description:
                            error.response.data.errors?.Description?.[0] || "",
                        listSymptom:
                            error.response.data.errors?.ListSymptom?.[0] || "",
                        image: error.response.data.errors?.Image?.[0] || "",
                    },
                });
            }
            if (!error.response.data.status) {
                toast.error(error.response.data.message);
            }
        }
    };

    handleDeleteDisease = async (item) => {
        try {
            await deleteDiseaseApi(item.id);
            await this.getAllDisease(this.state.pageIndex);
            toast.success("Xóa thành công");
        } catch (error) {
            if (!error.response.data.status) {
                toast.error(error.response.data.message);
            }
        }
    };

    handleEditDisease = (item) => {
        console.log("item ", item);
        this.setState({
            errMessage: {
                name: "",
                description: "",
                listSymptom: "",
                image: "",
            },
            isOpenModalEditDisease: true,
            editDisease: item,
        });
    };

    doEditDisease = async (data) => {
        this.setState({
            errMessage: {
                name: "",
                description: "",
            },
        });
        try {
            console.log(data);
            await updateDiseaseApi(data);
            await this.getAllDisease(this.state.pageIndex);
            this.toggleDiseaseEditModal();
            toast.success("Sửa thành công");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                this.setState({
                    errMessage: {
                        name: error.response.data.errors?.Name?.[0] || "",
                        description:
                            error.response.data.errors?.Description?.[0] || "",
                    },
                });
            }
            if (!error.response.data.status) {
                toast.error(error.response.data.message);
            }
        }
    };

    handlePageChange = (pageIndex) => {
        console.log(pageIndex.selected);
        this.setState(
            {
                pageIndex: pageIndex.selected,
            },
            async () => await this.getAllDisease(this.state.pageIndex)
        );
    };

    render() {
        let arrDiseases = this.state.arrDiseases;
        return (
            <div className="users-container">
                <ModalDisease
                    isOpen={this.state.isOpenModalDisease}
                    toggleDiseaseModal={this.toggleDiseaseModal}
                    createDisease={this.createDisease}
                    listError={this.state.errMessage}
                />

                {this.state.isOpenModalEditDisease && (
                    <ModalEditDisease
                        isOpen={this.state.isOpenModalEditDisease}
                        toggleDiseaseEditModal={this.toggleDiseaseEditModal}
                        editDisease={this.state.editDisease}
                        doEditDisease={this.doEditDisease}
                        listError={this.state.errMessage}
                    />
                )}
                <div className="title text-center">Quản lý bệnh</div>
                <div className="mx-1">
                    <button
                        className="btn btn-primary px-3"
                        onClick={() => this.handleAddNewDisease()}
                    >
                        <i className="fa-solid fa-plus"></i> Thêm Bệnh
                    </button>
                </div>
                <div className="users-table mt-3 mx-1">
                    <CustomScrollbars style={{ height: "427px", with: "100%" }}>
                        <table id="disease-table">
                            <tbody>
                                <tr>
                                    <th>Tên bệnh</th>
                                    <th style={{ width: "15%" }}>Hình ảnh</th>
                                    <th style={{ width: "55%" }}>
                                        Thông tin bệnh
                                    </th>
                                    <th style={{ width: "10%" }}>Hành Động</th>
                                </tr>

                                {arrDiseases &&
                                    arrDiseases.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td
                                                    className="preview-image"
                                                    style={{
                                                        backgroundImage: `url(${item.image})`,
                                                    }}
                                                />
                                                <td className="text-limit">
                                                    {item.description}
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => {
                                                            this.handleEditDisease(
                                                                item
                                                            );
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-pencil"></i>
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => {
                                                            this.handleDeleteDisease(
                                                                item
                                                            );
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </CustomScrollbars>
                </div>

                <ReactPaginate
                    breakLabel={"..."}
                    breakClassName="page-link"
                    pageCount={this.state.countDisease}
                    marginPagesDisplayed={3}
                    onPageChange={this.handlePageChange}
                    containerClassName="pagination"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-link"
                    nextClassName="page-link"
                    activeClassName="active"
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DiseaseManage);
