import { GetServerSideProps, GetServerSidePropsContext } from "next";
import database from '../../../database/database'
import {makeStyles} from '@material-ui/core/styles'
import Header from '../../../components/nav/Header'
import SuccessfulConfirmation from '../../../components/emailConfirmation/SuccessfulConfirmation'
import UnsuccessfulConfirmation from '../../../components/emailConfirmation/UnsuccessfulConfirmation'

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh'
    }
}))

export default function ConfirmAccount({success}) {

    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Header loggedIn={false} user={null} />
            {success ? <SuccessfulConfirmation /> : <UnsuccessfulConfirmation />}
        </div>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const id = Array.isArray(ctx.params.token) ? ctx.params.token[0] : ctx.params.token

    try {
        const db = await database()
        const token = await db.collection('verificationTokens').findOne({'token': id})
        if(token) {
            await Promise.all([
                db.collection('verificationTokens').deleteOne({'token': id}),
                db.collection('users').updateOne({'_id': token.userId}, {'$set': {
                    'isVerified': true
                }})
            ])
            return {props: {success: true}}
        } else {
            return {props: {success: false}}
        }
    } catch(e) {
        console.log(e)
        return {props: {success: false}}
    }
}