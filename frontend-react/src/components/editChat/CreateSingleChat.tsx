import styles from './CreateSingleChat.module.scss'
import {Button, IconButton, InputAdornment, TextField} from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import React, {useEffect, useState} from "react";
import {UUID} from "node:crypto";
import {createChat, createGroupChat} from "../../redux/chat/ChatAction";
import {TOKEN} from "../../config/Config";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/Store";
import {UserDTO} from "../../redux/auth/AuthModel";
import GroupMember from "./GroupMember";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {searchUser} from "../../redux/auth/AuthAction";

interface CreateSingleChatProps {
    setIsShowCreateSingleChat: (isShowSingleChat: boolean) => void;
}


const CreateSingleChat = (props: CreateSingleChatProps) => {

    const authState = useSelector((state: RootState) => state.auth);
    const token = localStorage.getItem(TOKEN);
    const dispatch: AppDispatch = useDispatch();
    const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
    const [focused, setFocused] = useState<boolean>(false);
    const [userQuery, setUserQuery] = useState<string>("");

    useEffect(() => {
        if (token && userQuery.length > 0) {
            dispatch(searchUser(userQuery, token));
        }
    }, [userQuery, token]);

    const onHandleBack = () => {
        props.setIsShowCreateSingleChat(false);
    };

    const onCreate = () => {
        if (token && selectedUser) {
            dispatch(createChat(selectedUser.id, token));
            props.setIsShowCreateSingleChat(false);
        }
    };

    const onChangeQuery = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setUserQuery(e.target.value);
    };

    const onClearQuery = () => {
        setUserQuery("");
    };

    const onSetUser = (user: UserDTO) => {
        setSelectedUser(user);
    };

    return (
        <div className={styles.createSingleChatOuterContainer}>
            <div className={styles.createSingleChatNavContainer}>
                <IconButton onClick={onHandleBack}>
                    <WestIcon fontSize='medium'/>
                </IconButton>
                <h2>Create New Chat</h2>
            </div>
            <div className={styles.createSingleChatTextContainer}>
                <p className={styles.createSingleChatText}>Start chat with:</p>
            </div>
            <div className={styles.createSingleChatSelectedUserContainer}>
                {selectedUser && <GroupMember member={selectedUser} key={selectedUser.id}/>}
            </div>
            <div className={styles.createSingleChatTextField}>
                <TextField
                    id='searchUser'
                    type='text'
                    label='Search user to chat ...'
                    size='small'
                    fullWidth
                    value={userQuery}
                    onChange={onChangeQuery}
                    sx={{
                        backgroundColor: 'rgba(24,28,36,0.92)',
                        borderRadius: '22px',
                        color: '#fff',
                        input: { color: '#fff', fontWeight: 500, letterSpacing: '0.5px' },
                        label: { color: '#00eaff' },
                        boxShadow: 'none',
                        outline: 'none',
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: userQuery.length > 0 && (
                            <InputAdornment position='end'>
                                <IconButton onClick={onClearQuery}>
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                        sx: {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#00eaff',
                                borderWidth: 2,
                                borderRadius: '22px',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#00eaff',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#00eaff',
                                borderWidth: 2.5,
                            },
                        },
                        style: {
                            color: '#fff',
                            fontWeight: 500,
                            letterSpacing: '0.5px',
                            paddingLeft: 12,
                            paddingRight: 12,
                        },
                    }}
                    InputLabelProps={{
                        shrink: true,
                        style: { color: '#00eaff', opacity: 0.8, fontWeight: 500 },
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
            </div>
            <div className={styles.createSingleChatUserContainer}>
                {userQuery.length > 0 && authState.searchUser?.map(user =>
                    <GroupMember member={user} onAddMember={onSetUser} key={user.id}/>)}
            </div>
            <div className={styles.createSingleChatButton}>
                <Button variant={"contained"} onClick={onCreate}>Create Chat</Button>
            </div>
        </div>
    );
};

export default CreateSingleChat;