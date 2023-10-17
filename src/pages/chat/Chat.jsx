import React, { useState, useEffect } from "react";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import CustomDataGrid from "../../components/CustomDataGrid/CustomDataGrid";
import StoreMessage from "../../components/StoreMessage/StoreMessage";
import ChatService from "../../services/Chat";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { Button } from "@mui/material";
import ChatDialog from "../../components/Dialog/ChatDialog";
import { EmailMessageDialog } from "../../components/Dialog/EmailMessageDialog";
import renderCellExpand from "../../components/GridCellExpand/GridCellExpand";
import UserServicePortal from "../../services/UserServicePortal";
import classes from "./chat.module.css";

const timeZone = "Europe/Moscow";

const Chat = () => {
    const [chat, setChat] = useState([]);
    const [open, setOpen] = useState(false);
    const [emailOpen, setEmailOpen] = useState(false);
    const [dataFirstId, setDataFirstId] = useState("");
    const [chatItem, setChatItem] = useState([]);
    // const [curUser, setCurUser] = useState({});

    const handleClose = () => {
        setOpen(false);
        setDataFirstId("");
    };
    const handleCloseEmail = () => {
        setEmailOpen(false);
        setDataFirstId("");
        // setCurUser({});
    };

    async function getChat(id) {
        try {
            const response = await ChatService.getChatItem(id);
            console.log(response.data);
            setChatItem(
                response.data
                // response?.data?.history?.sort((a, b) => (a._id > b._id ? -1 : 1))
            );
            setDataFirstId(response.data[0]?.senderId);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleSubmit() {
        try {
            const response = await ChatService.sendMessages();
            setEmailOpen(false);
        } catch (error) {
            console.error(error);
        }
    }

    const PrepareChatDialog = async (id) => {
        // console.log('prepare history dialog',id );
        await getChat(id);
        setOpen(true);
    };

    // const getUserToId = async (id) => {
    //     try {
    //         const response = await UserServicePortal.getUserAmpToId(id);
    //         setCurUser(response?.data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    // const findAddressee = (members) => {
    //     const res = members.find((el) => el !== dataFirstId);
    //     return res;
    // };

    const PrepareEmailMessageDialog = async (id) => {
        await getChat(id);
        setEmailOpen(true);
        // const curId = await findAddressee(members);
        // await getUserToId(curId);
    };

    const columns = [
        {
            field: "members_name_title",
            headerName: "Чат между..",
            width: 400,
            editable: false,
            disableColumnMenu: true,
            headerAlign: "center",
            renderCell: renderCellExpand,
        },
        {
            field: "createdAt",
            headerName: "чат создан",
            width: 200,
            editable: false,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                return format(
                    utcToZonedTime(new Date(params?.value), timeZone),
                    "d.MM.yyyy HH:mm ",
                    {
                        timeZone: "Europe/Moscow",
                    }
                );
            },
        },
        {
            field: "action",
            headerName: "Действия",
            width: 240,
            headerAlign: "center",
            align: "center",
            disableColumnMenu: true,
            sortable: false,
            cellClassName: "actionStyle",
            renderCell: (params) => {
                return (
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => PrepareChatDialog(params?.row?._id)}
                        >
                            Смотреть переписку
                        </Button>
                    </div>
                );
            },
        },
        {
            field: "action1",
            headerName: "Отправить на почту",
            width: 240,
            headerAlign: "center",
            align: "center",
            disableColumnMenu: true,
            sortable: false,
            cellClassName: "actionStyle",
            renderCell: (params) => {
                return (
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() =>
                                PrepareEmailMessageDialog(params?.row?._id)
                            }
                            // onClick={() => console.log("params", params)}
                        >
                            <ForwardToInboxIcon />
                        </Button>
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        const getAllChats = async () => {
            try {
                const response = await ChatService.getChats();
                console.log("All chats >>> ", response.data);
                setChat(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        getAllChats();
    }, []);

    return (
        <>
            <EmailMessageDialog
                open={emailOpen}
                data={chatItem}
                handleClose={handleCloseEmail}
                dataFirstId={dataFirstId}
                handleSubmit={handleSubmit}
            />
            <ChatDialog
                open={open}
                handleClose={handleClose}
                data={chatItem}
                dataFirstId={dataFirstId}
            />
            <div className={classes.chatList}>
                <h1 className={classes.newChatTitle}>Чаты</h1>
                <StoreMessage />
                <CustomDataGrid rows={chat} columns={columns} />
            </div>
        </>
    );
};

export default Chat;
