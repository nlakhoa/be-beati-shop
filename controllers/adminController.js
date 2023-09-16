
const bcrypt = require('bcrypt');

const Perfume = require("../models/perfume");
const FacialCare = require("../models/facialCare");
const Makeup = require("../models/makeup");
const User = require("../models/user");
const Bill = require("../models/bill");
const { MongooseObject, mutiMongooseObject } = require("../util/Mongoose");

var salt = bcrypt.genSaltSync(10);

class AdminController {
    // Lấy tất cả sản phẩm
    getProduct = async (req, res, next) => {
        if (req.body) {
            Promise.all([Perfume.find({}), FacialCare.find({}), Makeup.find({})])
                .then(([perfume, facialCare, makeup]) => {
                    res.json({
                        perfume: mutiMongooseObject(perfume),
                        facialCare: mutiMongooseObject(facialCare),
                        makeup: mutiMongooseObject(makeup),
                    });
                })
                .catch(next);
        }
        else {
            return res.status(500).json({
                errCode: 1,
                mess: "Thông tin rỗng, vui lòng nhập lại",
            });
        }

    }
    // Thêm user
    createUser = async (req, res, next) => {
        if (req.body) {
            const user = await User.findOne({ account: req.body.account })
            console.log('user', user,)
            if (user) {
                return res.status(500).json({
                    errCode: 2,
                    mess: "Tài khoản đã tồn tại",
                });
            }
            else {
                let hashPassword = await bcrypt.hashSync(req.body.password, salt);
                req.body.password = hashPassword;
                req.body = new User(req.body);
                req.body
                    .save()
                    .then(() =>
                        res.json({
                            success: true,
                        })
                    )
                    .catch(next);

            }
        }
        else {
            return res.status(500).json({
                errCode: 1,
                mess: "Thông tin rỗng, vui lòng nhập lại",
            });
        }


    }

    // Tạo bill
    createBill = async (req, res, next) => {
        const arrProduct = JSON.parse(req.body.arrProduct)
        console.log(req.body)
        if (req.body) {
            req.body = new Bill(req.body);
            req.body
                .save()
                .then(() => {
                    for (let i = 0; i < arrProduct.length; i++) {
                        let sold = Number(arrProduct[i].sizeS) + Number(arrProduct[i].sizeM) + Number(arrProduct[i].sizeL)
                        arrProduct[i].item.sizeS -= arrProduct[i].sizeS 
                        arrProduct[i].item.sizeM -= arrProduct[i].sizeM
                        arrProduct[i].item.sizeL -= arrProduct[i].sizeS
                        arrProduct[i].item.currentSold += sold
                        if (arrProduct[i].item.type == 'perfume') {
                            console.log('arrProduct[i].id', arrProduct[i], arrProduct[i].id)
                            Perfume.updateOne({ _id: arrProduct[i].id }, arrProduct[i].item).then(() => {
                                return res.json({ success: true, message: "Thêm bill thành công" });
                            })
                                .catch(next);
                        }
                        else if (arrProduct[i].item.type == 'makeup') {
                            Makeup.updateOne({ _id: arrProduct[i].id }, arrProduct[i].item).then(() => {
                                return res.json({ success: true, message: "Thêm bill thành công" });
                            })
                                .catch(next);
                        }
                        else if (arrProduct[i].item.type == 'facialCare') {
                            FacialCare.updateOne({ _id: arrProduct[i].id }, arrProduct[i].item).then(() => {
                                return res.json({ success: true, message: "Thêm bill thành công" });
                            })
                                .catch(next);
                        }
                    }

                }
                )
                .catch(next);
        }
        else {
            return res.status(500).json({
                errCode: 1,
                mess: "Thông tin rỗng, vui lòng nhập lại",
            });
        }



    }

    // Lấy tất cả user
    getUser(req, res, next) {
        User.find()
            .then(users => {
                res.json({
                    users: mutiMongooseObject(users),
                });
            })
            .catch(error => {
                console.log(error);
            });

    }

    getBill(req, res, next) {
        Bill.find()
            .then(bills => {
                res.json({
                    bills: mutiMongooseObject(bills),
                });
            })
            .catch(error => {
                console.log(error);
            });

    }

    // Đăng nhập
    login = async (req, res, next) => {
        const account = req.body.account;
        const password = req.body.password;
        console.log("req.body", req.body)
        if (!account || !password) {
            return res.status(500).json({
                errCode: 1,
                mess: "Tài khoản hoặc mật khẩu rỗng",
            });
        } 
        else {
            const user = await User.findOne({ account: account })
            if (user) {
                let result = await bcrypt.compareSync(password, user.password);
                if (result) {
                    return res.status(200).json({ errCode: 0, user: user });
                }
                else {
                    return res.status(500).json({
                        errCode: 2,
                        mess: "Mật khẩu không đúng, vui lòng thử lại",
                    });
                }
            }
            else {
                return res.status(500).json({
                    errCode: 3,
                    mess: "Tài khoản không tồn tại",
                });
            }

        }

    }

    editUserByID = async (req, res, next) => {
        const id = req.params.id;
        console.log('id', id)
        if (!id) {
            return res.status(500).json({
                errCode: 1,
                mess: "Chưa truyền id",
            });
        } else {
            User.updateOne({ _id: req.params.id }, req.body)
                .then(async() => {
                    const user = await User.findOne({ account: req.body.account })
                    return res.json({ errCode: 0, success: true, message: "Update user thành công", user: user });
                })

        }


    }


    edit(req, res, next) {
        Promise.all([
            Perfume.findById(req.params.id),
            FacialCare.findById(req.params.id),
            Makeup.findById(req.params.id),
        ])
            .then(([perfume, facialCare, makeup]) => {
                let value;
                if (perfume != null) {
                    value = MongooseObject(perfume);
                    res.json({ value });
                } else if (facialCare != null) {
                    value = MongooseObject(facialCare);
                    res.json({ value });
                } else {
                    value = MongooseObject(makeup);
                    res.json({ value });
                }
            })
            .catch(next);
    }


    updateProduct = async (req, res, next) => {
        let value
        if (req.params.type == 'perfume') {
            Perfume.updateOne({ _id: req.params.id }, req.body).then(() => {
                return res.json({ success: true, message: "Update Perfume thành công" });
            })
                .catch(next);
        }
        else if (req.params.type == 'makeup') {
            Makeup.updateOne({ _id: req.params.id }, req.body).then(() => {
                return res.json({ success: true, message: "Update Perfume thành công" });
            })
                .catch(next);
        }
        else if (req.params.type == 'facialCare') {
            FacialCare.updateOne({ _id: req.params.id }, req.body).then(() => {
                return res.json({ success: true, message: "Update Perfume thành công" });
            })
                .catch(next);
        }


    }

    updateBill = async (req, res, next) => {
        console.log('req.params', req.params)
        if (req.params.id) {
            let bill = await Bill.findOne({ _id: req.params.id })
            bill.status = bill.status < 2 ? bill.status += 1 : 2
            if (bill) {
                Bill.updateOne({ _id: req.params.id }, bill).then(() => {
                    return res.json({ success: true, message: "Update bill thành công" });
                })
                    .catch(next);
            }
            else {
                return res.json({ success: false, message: "Không tìm thấy đơn hàng" });

            }
        }


    }

    async createProduct(req, res, next) {
        switch (req.body.type) {
            case "Perfume":
                if (req.body) {
                    req.body = new Perfume(req.body);
                    req.body
                        .save()
                        .then(() =>
                            res.json({
                                success: true,
                            })
                        )
                        .catch(next);
                    break;
                }
                else {
                    return res.status(500).json({
                        errCode: 1,
                        mess: "Thông tin sản phẩm không đủ, vui lòng nhập đủ",
                    });
                }
            case "facialCare":
                if (req.body) {
                    req.body = new FacialCare(req.body);
                    req.body
                        .save()
                        .then(() =>
                            res.json({
                                success: true,
                            })
                        )
                        .catch(next);
                    break;
                }
                else {
                    return res.status(500).json({
                        errCode: 1,
                        mess: "Thông tin sản phẩm không đủ, vui lòng nhập đủ",
                    });
                }

            case "makeup":
                if (req.body) {
                    req.body = new Makeup(req.body);
                    req.body
                        .save()
                        .then(() =>
                            res.json({
                                success: true,
                            })
                        )
                        .catch(next);
                    break;
                }
                else {
                    return res.status(500).json({
                        errCode: 1,
                        mess: "Thông tin sản phẩm không đủ, vui lòng nhập đủ",
                    });
                }

            default:
                break;
        }
    }


    deleteUser(req, res, next) {
        User.deleteOne({ _id: req.params.id })
            .then(() => {
                res.json({
                    success: true,
                });
            })
            .catch(next);
    }

    async deleteProduct(req, res, next) {
        if (req.params.type == 'perfume') {
            Perfume.deleteOne({ _id: req.params.id }).then(() => {
                return res.json({ success: true, message: "Delete Perfume thành công" });
            })
                .catch(next);
        }
        else if (req.params.type == 'makeup') {
            await Makeup.deleteOne({ _id: req.params.id })
            Makeup.deleteOne({ _id: req.params.id }).then(() => {
                return res.json({ success: true, message: "Delete Makeup thành công" });
            })
                .catch(next);
        }
        else if (req.params.type == 'facialCare') {
            await FacialCare.deleteOne({ _id: req.params.id })
            FacialCare.deleteOne({ _id: req.params.id }).then(() => {
                return res.json({ success: true, message: "Delete FacialCare thành công" });
            })
                .catch(next);
        }
    }


}
module.exports = new AdminController();


