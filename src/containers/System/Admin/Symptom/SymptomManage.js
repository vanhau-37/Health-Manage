import React, { Component } from "react";
import { connect } from "react-redux";
import {
    getAllSymptomApi,
    createSymptomApi,
    deleteSymptomApi,
    updateSymptomApi,
} from "../../../../services/symptomService";
import ModalSymptom from "./ModalSymptom";
import ModalEditSymptom from "./ModalEditSymptom";
import { emitter } from "../../../../utils/emitter";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import CustomScrollbars from "../../../../components/CustomScrollbars";

class SymptomManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrSymptoms: [],
            isOpenModalSymptom: false,
            isOpenModalEditSymptom: false,
            errMessage: {
                name: "",
                description: "",
            },
            editSymptom: {},
            totalPage: 1,
            pageIndex: 0,
        };
    }

    async componentDidMount() {
        await this.getAllSymptom(this.state.pageIndex);
    }

    getAllSymptom = async (pageIndex) => {
        try {
            let res = await getAllSymptomApi(pageIndex);
            if (res.status) {console.log(res)
                this.setState({
                    arrSymptoms: res.data.symptoms,
                    totalPage: res.data.totalPage,
                });
            }
        } catch (error) {
            if (!error.response.data.status) {
                alert(error.response.data.message);
            }
        }
    };

    toggleSymptomModal = () => {
        this.setState({
            isOpenModalSymptom: !this.state.isOpenModalSymptom,
        });
    };

    toggleSymptomEditModal = () => {
        this.setState({
            isOpenModalEditSymptom: !this.state.isOpenModalEditSymptom,
        });
    };

    handleAddNewSymptom = () => {
        this.setState({ isOpenModalSymptom: true });
    };

    createSymptom = async (data) => {
        this.setState({
            errMessage: {
                name: "",
                description: "",
            },
        });
        try {
            await createSymptomApi(data);
            await this.getAllSymptom(this.state.pageIndex);
            this.toggleSymptomModal();
            toast.success("Thêm thành công");
            emitter.emit("EVENT_CLEAR_MODAL_DATA");
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

    handleDeleteSymptom = async (item) => {
        try {
            await deleteSymptomApi(item.id);
            await this.getAllSymptom(this.state.pageIndex);
            toast.success("Xóa thành công");
        } catch (error) {
            if (!error.response.data.status) {
                toast.error(error.response.data.message);
            }
        }
    };

    handleEditSymptom = (item) => {
        this.setState({
            isOpenModalEditSymptom: true,
            editSymptom: item,
        });
    };

    doEditSymptom = async (data) => {
        this.setState({
            errMessage: {
                name: "",
                description: "",
            },
        });
        try {
            await updateSymptomApi(data);
            await this.getAllSymptom(this.state.pageIndex);
            this.toggleSymptomEditModal();
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
            async () => await this.getAllSymptom(this.state.pageIndex)
        );
    };

    render() {
        let arrSymptoms = this.state.arrSymptoms;
        return (
            <div className="users-container">
                <ModalSymptom
                    isOpen={this.state.isOpenModalSymptom}
                    toggleSymptomModal={this.toggleSymptomModal}
                    createSymptom={this.createSymptom}
                    listError={this.state.errMessage}
                />

                {this.state.isOpenModalEditSymptom && (
                    <ModalEditSymptom
                        isOpen={this.state.isOpenModalEditSymptom}
                        toggleSymptomEditModal={this.toggleSymptomEditModal}
                        editSymptom={this.state.editSymptom}
                        doEditSymptom={this.doEditSymptom}
                        listError={this.state.errMessage}
                    />
                )}
                <div className="title text-center">Quản lý triệu chứng</div>
                <div className="mx-1">
                    <button
                        className="btn btn-primary px-3"
                        onClick={() => this.handleAddNewSymptom()}
                    >
                        <i className="fa-solid fa-plus"></i> Thêm Triệu Chứng
                    </button>
                </div>
                <div className="users-table mt-3 mx-1">
                    <CustomScrollbars style={{ height: "445px", with: "100%" }}>
                        <table id="customers">
                            <tbody>
                                <tr>
                                    <th style={{ width:"20%" }}>Tên triệu chứng</th>
                                    <th>Mô tả triệu chứng</th>
                                    <th style={{ width:"10%" }}>Hành Động</th>
                                </tr>

                                {arrSymptoms &&
                                    arrSymptoms.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>{item.description}</td>
                                                <td>
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => {
                                                            this.handleEditSymptom(
                                                                item
                                                            );
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-pencil"></i>
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => {
                                                            this.handleDeleteSymptom(
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
                    pageCount={this.state.totalPage}
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

export default connect(mapStateToProps, mapDispatchToProps)(SymptomManage);
