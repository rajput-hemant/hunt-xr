'use client';

import { openContractCall, showConnect, ContractCallOptions } from "@stacks/connect";
import { appDetails, mintingSBTCToastMessage } from "./constants";
import { useStacks } from "../providers/StacksProvider";
import { Button, Modal } from "antd";
import { useState } from "react";
import { useTransactionToasts } from "@/providers/TransactionAndOrderProvider";
import { useBitThetixState } from "@/providers/BitThetixStateProvider";
import _ from "lodash";
import { AnchorMode } from "@stacks/transactions";

export default function Auth() {
    const { address = "", userSession, network } = useStacks();
    const { addTransactionToast } = useTransactionToasts();
    const { sBTCBalance, totalBalance } = useBitThetixState();
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState(
        'Mint sBTC for free so you can start trading.'
    );

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async () => {
        setConfirmLoading(true);

        const options: ContractCallOptions = {
            contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
            contractName: "sbtc",
            functionName: 'mint-bitthetix-testnet',
            functionArgs: [],
            postConditions: [],
            network,
            appDetails,
            anchorMode: AnchorMode.Any,
            onFinish: (({ stacksTransaction }) => {
                addTransactionToast(stacksTransaction.txid(), mintingSBTCToastMessage);
            }),
        }
        await openContractCall(options);
        setOpen(false);
        setConfirmLoading(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleLogIn = async () => {
        console.log("hitting ")
        showConnect({
            appDetails,
            onFinish: () => window.location.reload(),
            userSession,
        });
    }

    const logUserOut = async () => {
        userSession.signUserOut();
        window.location.reload();
    }

    if (address) {
        return (
            <>
                <div style={{ flexGrow: 1 }}></div>
                {!Boolean(totalBalance) && <Button type="primary" onClick={() => setOpen(true)}>Mint sBTC</Button>}
                {Boolean(totalBalance) && <Button style={{ marginLeft: 10 }} onClick={_.noop}>{sBTCBalance} sBTC</Button>}
                <Button style={{ marginLeft: 10 }} onClick={logUserOut}>{address.slice(0, 3)}...{address.slice(address.length - 3)}</Button>
                <Modal
                    title="Mint sBTC"
                    open={open}
                    onOk={handleOk}
                    okText="Confirm Mint"
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                >
                    <p>{modalText}</p>
                </Modal>
            </>
        );
    } else {
        return (
            <Button onClick={handleLogIn}>Connect Wallet</Button>
        )
    }
}