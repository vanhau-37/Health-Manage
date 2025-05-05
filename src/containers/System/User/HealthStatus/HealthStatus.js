import React, { Component } from "react";
import { connect } from "react-redux";
import "./HealthStatus.scss";
import {
    createHealthStatusApi,
    createHealthStatusAutoMLTableApi,
    getAllHealthStatusByIdApi,
    diagnosisDisease,
    diagnosisDiseaseVertexAi,
    updateHealthStatusApi,
    updateHealthStatusAutoMLTableApi,
    deleteHealthStatusApi,
} from "../../../../services/healthStatusService";
import ModalHealthStatus from "./ModalHealthStatus";
import { emitter } from "../../../../utils/emitter";
import { toast } from "react-toastify";
import ModalEditHealthStatus from "./ModalEditHealthStatus";
import ReactPaginate from "react-paginate";
import CalendarFromTo from "../../../../components/CalendarFromTo";

class HealthStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrHealthStatus: [],
            isOpenModalHealthStatus: false,
            isOpenModalEditHealthStatus: false,
            errMessage: {
                weight: "",
                height: "",
                temperature: "",
                listIdStatus: "",
                // status:"",//VertexAi
            },
            editHealthStatus: {},
            totalPage: 1,
            pageIndex: 0,
            isShowFilter: false,
            from: "",
            to: "",
        };
    }

    async componentDidMount() {
        if (this.props.userInfo && this.props.userInfo.nameid) {
            await this.getAllHealthStatusById(
                this.props.userInfo.nameid,
                null,
                null,
                this.state.pageIndex
            );
            console.log("component did mount");
        }
    }

    async componentDidUpdate(prevProps) {
        if (
            this.props.userInfo !== prevProps.userInfo &&
            this.props.userInfo &&
            this.props.userInfo.nameid
        ) {
            await this.getAllHealthStatusById(
                this.props.userInfo.nameid,
                this.state.from,
                this.state.to
            );
            console.log("component did update");
        }
    }

    getAllHealthStatusById = async (id, from, to, pageIndex) => {
        try {
            from = from === "" ? null : from;
            to = to === "" ? null : to;
            let res = await getAllHealthStatusByIdApi(id, from, to, pageIndex);
            if (res.status) {
                this.setState({
                    arrHealthStatus: res.data.healthStatuses,
                    totalPage: res.data.totalPage,
                });
            }
            console.log(this.state.arrHealthStatus);
        } catch (error) {
            if (!error.response.data.status) {
                toast.error(error.response.data.message);
            }
        }
    };

    toggleHealthStatusModal = (type) => {
        this.setState(
            {
                errMessage: {
                    weight: "",
                    height: "",
                    temperature: "",
                    listIdStatus: "",
                },
            },
            () => {
                let copyyState = { ...this.state };
                copyyState[type] = !copyyState[type];
                this.setState({
                    ...copyyState,
                });
            }
        );
    };

    handleAddHealthStatus = (type) => {
        this.toggleHealthStatusModal(type);
    };

    handleEditHealthStatus = (item, type) => {
        console.log("item ", item);
        this.setState(
            {
                editHealthStatus: item,
            },
            () => this.toggleHealthStatusModal(type)
        );
    };

    handleDeleteHealthStatus = async (item) => {
        try {
            await deleteHealthStatusApi(item.id);
            await this.getAllHealthStatusById(
                this.props.userInfo.nameid,
                this.state.from,
                this.state.to
            );
            toast.success("Xóa thành công");
        } catch (error) {
            if (!error.response.data.status) {
                toast.error(error.response.data.message);
            }
        }
    };

    createHealthStatus = async (data) => {
        this.setState({
            errMessage: {
                weight: "",
                height: "",
                temperature: "",
                listIdStatus: "",
            },
        });
        try {
            await createHealthStatusApi(data);
            await this.getAllHealthStatusById(
                this.props.userInfo.nameid,
                this.state.from,
                this.state.to,
                this.state.pageIndex
            );
            this.toggleHealthStatusModal("isOpenModalHealthStatus");
            toast.success("Thêm thành công");
            emitter.emit("EVENT_CLEAR_MODAL_DATA");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                this.setState({
                    errMessage: {
                        weight: error.response.data.errors?.Weight?.[0] || "",
                        height: error.response.data.errors?.Height?.[0] || "",
                        temperature:
                            error.response.data.errors?.Temperature?.[0] || "",
                        listIdStatus:
                            error.response.data.errors?.ListIdStatus?.[0] || "",
                    },
                });
            }
        }
    };

    // createHealthStatus = async (data) => {//VertexAi
    //     this.setState({
    //         errMessage: {
    //             weight: "",
    //             height: "",
    //             temperature: "",
    //             status: "", //vertexAI
    //         },
    //     });
    //     try {
    //         await createHealthStatusAutoMLTableApi(data); //vertexAI
    //         await this.getAllHealthStatusById(
    //             this.props.userInfo.nameid,
    //             this.state.from,
    //             this.state.to,
    //             this.state.pageIndex
    //         );
    //         this.toggleHealthStatusModal("isOpenModalHealthStatus");
    //         toast.success("Thêm thành công");
    //         emitter.emit("EVENT_CLEAR_MODAL_DATA");
    //     } catch (error) {
    //         if (error.response && error.response.status === 400) {
    //             this.setState({
    //                 errMessage: {
    //                     weight: error.response.data.errors?.Weight?.[0] || "",
    //                     height: error.response.data.errors?.Height?.[0] || "",
    //                     temperature:
    //                         error.response.data.errors?.Temperature?.[0] || "",
    //                     status:
    //                         error.response.data.errors?.Status?.[0] || "",
    //                 },
    //             });
    //         }
    //     }
    // };

    doEditHealthStatus = async (data) => {
        this.setState({
            errMessage: {
                weight: "",
                height: "",
                temperature: "",
                listIdStatus: "",
            },
        });
        try {
            await updateHealthStatusApi(data);
            await this.getAllHealthStatusById(
                this.props.userInfo.nameid,
                this.state.from,
                this.state.to,
                this.state.pageIndex
            );
            this.toggleHealthStatusModal("isOpenModalEditHealthStatus");
            toast.success("Cập nhật thành công");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                this.setState({
                    errMessage: {
                        weight: error.response.data.errors?.Weight?.[0] || "",
                        height: error.response.data.errors?.Height?.[0] || "",
                        temperature:
                            error.response.data.errors?.Temperature?.[0] || "",
                        listIdStatus:
                            error.response.data.errors?.ListIdStatus?.[0] || "",
                    },
                });
            }
        }
    };

    // doEditHealthStatus = async (data) => {// VertexAI
    //     this.setState({
    //         errMessage: {
    //             weight: "",
    //             height: "",
    //             temperature: "",
    //             status: "",
    //         },
    //     });
    //     try {
    //         await updateHealthStatusAutoMLTableApi(data);
    //         await this.getAllHealthStatusById(
    //             this.props.userInfo.nameid,
    //             this.state.from,
    //             this.state.to,
    //             this.state.pageIndex
    //         );
    //         this.toggleHealthStatusModal("isOpenModalEditHealthStatus");
    //         toast.success("Cập nhật thành công");
    //     } catch (error) {
    //         if (error.response && error.response.status === 400) {
    //             this.setState({
    //                 errMessage: {
    //                     weight: error.response.data.errors?.Weight?.[0] || "",
    //                     height: error.response.data.errors?.Height?.[0] || "",
    //                     temperature:
    //                         error.response.data.errors?.Temperature?.[0] || "",
    //                     status:
    //                         error.response.data.errors?.Status?.[0] || "",
    //                 },
    //             });
    //         }
    //     }
    // };

    handleCheck = async (item) => {
        try {
            console.log("check ", item);
            await diagnosisDisease(item);
            await this.getAllHealthStatusById(
                this.props.userInfo.nameid,
                this.state.from,
                this.state.to,
                this.state.pageIndex
            );
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message);
            }
        }
    };

    // handleCheck = async (item) => {//vertexAI
    //     try {
    //         console.log("check ", item);
    //         var res = await diagnosisDiseaseVertexAi(item);
    //         await this.getAllHealthStatusById(
    //             this.props.userInfo.nameid,
    //             this.state.from,
    //             this.state.to,
    //             this.state.pageIndex
    //         );
    //         if (res && res.status === false) {
    //             toast.error(res.message)
    //         }
    //         console.log("check diagnosis VertextAi ",res)
    //     } catch (error) {
    //         if (error.response && error.response.status === 400) {
    //             alert(error.response.data.message);
    //         }
    //     }
    // };

    handlePageChange = (pageIndex) => {
        console.log(pageIndex.selected);
        this.setState(
            {
                pageIndex: pageIndex.selected,
            },
            async () =>
                await this.getAllHealthStatusById(
                    this.props.userInfo.nameid,
                    this.state.from,
                    this.state.to,
                    this.state.pageIndex
                )
        );
    };

    handleBMI = (bmi) => {
        if (bmi < 18.5) return "Cân nặng-Thiếu cân, ";
        if (bmi <= 22.9) return "Cân nặng-Bình thường, ";
        if (bmi <= 24.9) return "Cân nặng-Thừa cân, ";
        if (bmi <= 29.9) return "Cân nặng-Béo phì độ I, ";
        if (bmi <= 39.9) return "Cân nặng-Béo phì độ II, ";
        return "Cân nặng-Béo phì độ III, ";
    };

    handleShowFilter = () => {
        this.setState(
            {
                isShowFilter: !this.state.isShowFilter,
                from: "",
                to: "",
            },
            async () =>
                await this.getAllHealthStatusById(
                    this.props.userInfo.nameid,
                    this.state.from,
                    this.state.to,
                    this.state.pageIndex
                )
        );
    };

    updateFromTo = (from, to) => {
        this.setState(
            {
                from: from,
                to: to,
            },
            async () =>
                await this.getAllHealthStatusById(
                    this.props.userInfo.nameid,
                    this.state.from,
                    this.state.to,
                    this.state.pageIndex
                )
        );
    };

    render() {
        let arrHealthStatus = this.state.arrHealthStatus;
        return (
            <>
                <div className="add-modal-health-status">
                    <ModalHealthStatus
                        isOpen={this.state.isOpenModalHealthStatus}
                        toggleHealthStatusModal={this.toggleHealthStatusModal}
                        createHealthStatus={this.createHealthStatus}
                        listError={this.state.errMessage}
                    />

                    {this.state.isOpenModalEditHealthStatus && (
                        <ModalEditHealthStatus
                            isOpen={this.state.isOpenModalEditHealthStatus}
                            toggleHealthStatusModal={
                                this.toggleHealthStatusModal
                            }
                            editHealthStatus={this.state.editHealthStatus}
                            doEditHealthStatus={this.doEditHealthStatus}
                            listError={this.state.errMessage}
                        />
                    )}
                </div>

                <div className="option-container">
                    <div className="option-content">
                        <div className="left-option">
                            <button
                                className="button-filter"
                                onClick={this.handleShowFilter}
                            >
                                <i className="fa-solid fa-filter"></i>
                            </button>
                            {this.state.isShowFilter ? (
                                <CalendarFromTo
                                    updateFromTo={this.updateFromTo}
                                />
                            ) : null}
                        </div>

                        <div className="button-add-new">
                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    this.handleAddHealthStatus(
                                        "isOpenModalHealthStatus"
                                    )
                                }
                            >
                                Thêm mới
                            </button>
                        </div>
                    </div>
                </div>

                <div className="health-status-container">
                    <div className="box"></div>
                    {arrHealthStatus &&
                        arrHealthStatus.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className="health-status-content"
                                >
                                    <div className="content-left">
                                        <div className="child-content add-width">
                                            Ngày tạo:{" "}
                                            {new Date(
                                                item.createDate
                                            ).toLocaleDateString("vi-VN")}
                                        </div>
                                        <div className="child-content">
                                            Cân nặng: {item.weight} (kg)
                                        </div>
                                        <div className="child-content">
                                            Chiều cao: {item.height} (m)
                                        </div>
                                        <div className="child-content">
                                            Nhiệt độ: {item.temperature} (℃)
                                        </div>
                                        <div className="child-content">
                                            Chỉ số BMI:{" "}
                                            {(
                                                item.weight /
                                                (item.height * item.height)
                                            ).toFixed(1)}{" "}
                                            (kg/m2)
                                        </div>
                                        <div className="child-content add-width">
                                            Trạng thái cơ thể:{" "}
                                            {item.listSymptom
                                                .map((s) => s.name)
                                                .join(", ") || item.status}
                                        </div>
                                        <div className="child-content add-width">
                                            Kết quả dự đoán:{" "}
                                            {item.diagnosisOfDisease &&
                                                this.handleBMI(
                                                    (
                                                        item.weight /
                                                        (item.height *
                                                            item.height)
                                                    ).toFixed(1)
                                                )}
                                            {item.diagnosisOfDisease}
                                        </div>
                                    </div>
                                    <div className="content-right">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() =>
                                                this.handleEditHealthStatus(
                                                    item,
                                                    "isOpenModalEditHealthStatus"
                                                )
                                            }
                                        >
                                            Cập nhật
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() =>
                                                this.handleDeleteHealthStatus(
                                                    item
                                                )
                                            }
                                        >
                                            Xóa
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() =>
                                                this.handleCheck(item)
                                            }
                                        >
                                            Kiểm tra
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
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
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HealthStatus);
