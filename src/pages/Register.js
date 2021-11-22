import React, { useState, useEffect, useMemo } from "react";
import background from "../images/bg.jpg";
import Input from "../components/Inputs/Input";
import Buttons from "../components/Buttons/Buttons";
import useHttp from "../api/useHttp";
import { useHistory } from "react-router-dom";
import warnIng from "../images/warning.svg";
import LoadingBar from "react-top-loading-bar";
import { useSelector } from "react-redux";
import ToolTip from "../components/Inputs/ToolTip";
import Modal from 'react-bootstrap/Modal';

const Register = (props) => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [warningPop, setWarningPop] = useState(false);

    const [warning, setWarning] = useState([]);
    const [deneme, setDeneme] = useState(false);
    const [myArray, setmyArray] = useState(null);

    let history = useHistory();
    const Theme = useSelector((state) => state.theme.theme);
    const { isLoading, error, sendRequest: sendValues } = useHttp();

    /*****************************************************************************/

    const nameHandler = (event) => {
        setName(event.target.value);
    };
    const surnameHandler = (event) => {
        setSurname(event.target.value);
    };
    const emailHandler = (event) => {
        setEmail(event.target.value);
    };
    const passwordHandler = (event) => {
        setPassword(event.target.value);
    };
    const passwordAgainHandler = (event) => {
        setPasswordAgain(event.target.value);
    };
    /*****************************************************************************/

    const RegisterHandler = (event) => {
        setWarning([]);
        event.preventDefault();
        /* getting current date*/
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0");
        var yyyy = today.getFullYear();
        /*  creationDate: new Date(),*/

        let nameController = /^[a-zA-ZğüşöçİĞÜŞÖÇ1234567890]+$/.test(name);
        let surnameController = /^[a-zA-ZğüşöçİĞÜŞÖÇ1234567890]+$/.test(surname);
        let reg = /^\d+$/.test(password);
        const values = {
            user_name: name,
            user_surname: surname,
            user_email: email,
            user_password: password,
            user_creation_date: today,
        };
        if (password != passwordAgain) {
            setWarning((oldArray) => [...oldArray, "Şifreler uyuşmuyor."]);
            return;
        } else if (
            password == password.toLowerCase ||
            password.length < 6 ||
            !/\d/.test(password) ||
            !/[$-/:-?{-~!"^_`\[\]]/.test(password)
        ) {
            setWarning((oldArray) => [
                ...oldArray,
                "Şifre istenen özellikleri sağlamıyor.",
            ]);
            return;
        }
        if (!nameController || !surnameController) {
            setWarning((oldArray) => [...oldArray, "Ad ve soyad tanımlanamıyor."]);
            return;
        }

        if (warning.length < 1)
            setWarningPop(true)

        fetch("https://teklifyap-backend.herokuapp.com/api/user/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((response) => response.json())
            .then((data) => setmyArray(data));
    };

    useEffect(() => {
        if (myArray != null) {
            setWarning([]);
            if (!myArray.success) {
                setWarning((oldArray) => [
                    ...oldArray,
                    "Girilen email başka bir kullanıcı tarafından alınmış.",
                ]);
            } else {
                history.push("/Login");
            }
        }
    }, [myArray]);

    return (
        <React.Fragment>

            <div className="container-fluid position-relative overflow-hidden vh-100 p-0">
                <img className="background-img  " src={background}></img>
                <div className="img-cover-color"></div>

                <div className="container mt-5">
                    <div className="d-flex justify-content-center">
                        <div className={!Theme ? "p-5 round round-default-theme" : "p-5 round round-dark-theme"}>
                            {//col-12 col-sm-12 col-md-11 col-lg-10 col-xl-8
                            }
                            <div className="d-flex flex-column flex-lg-row">

                                <div className="col-lg-5">
                                    <form onSubmit={RegisterHandler}>
                                        <div>
                                            <div className="hover-me">
                                                <Input
                                                    title="Ad"
                                                    enteredValue={nameHandler}
                                                    inputValue={name}
                                                    maxlength="10"
                                                ></Input>
                                            </div>

                                            <ToolTip title1="Ad ve soyad yalnızca rakam veya harflerden oluşabilir."></ToolTip>
                                        </div>

                                        <div className="mt-3">
                                            <Input
                                                title="Soyad"
                                                enteredValue={surnameHandler}
                                                inputValue={surname}
                                                maxlength="10"
                                            ></Input>
                                        </div>

                                        <div className="mt-3">
                                            <div className="hover-me">
                                                <Input
                                                    title="Email"
                                                    enteredValue={emailHandler}
                                                    inputValue={email}
                                                    maxlength="35"
                                                ></Input>
                                            </div>
                                            <ToolTip
                                                title1="Email @abc.com yapısı ile bitmeli"
                                                title2="ve öncesinde özel karakter içermemelidir."
                                            ></ToolTip>
                                        </div>

                                        <div className="mt-3">
                                            <div className="hover-me">
                                                <Input
                                                    title="Şifre"
                                                    enteredValue={passwordHandler}
                                                    inputValue={password}
                                                ></Input>
                                            </div>

                                            <ToolTip
                                                title1="Şifre en az 6 karakter içermeli;"
                                                title2="*En az bir büyük harf,"
                                                title3="*En az bir rakam,"
                                                title4="*En az bir sembol barındırmalıdır."
                                            ></ToolTip>
                                        </div>

                                        <div className="mt-3">
                                            <Input
                                                title="Şifrenizi tekrar giriniz"
                                                enteredValue={passwordAgainHandler}
                                                inputValue={passwordAgain}
                                            ></Input>
                                        </div>

                                        {warning.map((index) => (
                                            <div className="col-11 user-select-none">
                                                <div className="d-flex align-self-start">
                                                    <img className="warning-img d-inline" src={warnIng} />
                                                    <div className="ms-1 warning-text">{index}</div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="d-flex justify-content-center mt-4 mb-2">
                                            <Buttons
                                                title="Kayıt Ol"
                                                disabled={
                                                    myArray != null
                                                        ? myArray.success
                                                            ? true
                                                            : false
                                                        : null
                                                }
                                            ></Buttons>
                                        </div>
                                    </form>
                                </div>

                                <div
                                    className={
                                        !Theme
                                            ? "col-lg-2 mb-2 or-text or-text-default-theme d-flex align-items-center justify-content-center fs-5 user-select-none"
                                            : "col-lg-2 mb-2 or-text or-text-dark-theme d-flex align-items-center justify-content-center fs-5 user-select-none"
                                    }
                                >
                                    veya
                                </div>

                                <div className="col-lg-5">
                                    <div className="d-flex flex-column ">

                                        <div className="hover-me">
                                            <div className="d-flex justify-content-center">
                                                <Buttons
                                                    title="Facebook İle Kayıt Ol"
                                                    disabled={true}
                                                ></Buttons>
                                            </div>
                                        </div>

                                        <ToolTip title1="Yakın zamanda eklenecek."></ToolTip>

                                        <div className="mt-2">
                                            <div className="hover-me">
                                                <div className="d-flex justify-content-center">
                                                    <Buttons
                                                        title="Google İle Kayıt Ol"
                                                        disabled={true}
                                                    ></Buttons>
                                                </div>

                                            </div>
                                            <ToolTip title1="Yakın zamanda eklenecek."></ToolTip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={warningPop} centered backdrop="static" size="sm">
                <Modal.Header className="bg-opacity-75 bg-warning">
                    <Modal.Title className="user-select-none">Kayıt yapılırken bekleyin!</Modal.Title>
                </Modal.Header>

                <Modal.Body className="user-select-none">
                    Sabrınız için teşekkür ederiz.
                </Modal.Body>
            </Modal>
        </React.Fragment>


    );
};
export default Register;
