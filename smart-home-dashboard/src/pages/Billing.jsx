import { Grid } from "@mui/material"
import SoftBox from "components/SoftBox"
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard"
import MasterCard from "examples/Cards/MasterCard"
import BillingInformation from "layouts/billing/components/BillingInformation"
import Invoices from "layouts/billing/components/Invoices"
import PaymentMethod from "layouts/billing/components/PaymentMethod"
import Transactions from "layouts/billing/components/Transactions"

const Billing=(props)=>{

    return(
    <SoftBox mt={4}>
        <SoftBox mb={1.5}>
            <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
                <Grid container spacing={3}>
                <Grid item xs={12} xl={6}>
                    <MasterCard number={4562112245947852} holder="jack peterson" expires="11/22" />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                    <DefaultInfoCard
                    icon="account_balance"
                    title="salary"
                    description="Belong Interactive"
                    value="+$2000"
                    />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                    <DefaultInfoCard
                    icon="paypal"
                    title="paypal"
                    description="Freelance Payment"
                    value="$455.00"
                    />
                </Grid>
                <Grid item xs={12}>
                    <PaymentMethod />
                </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} lg={4}>
                <Invoices />
            </Grid>
            </Grid>
        </SoftBox>
        <SoftBox my={3}>
            <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
                <BillingInformation />
            </Grid>
            <Grid item xs={12} md={5}>
                <Transactions />
            </Grid>
            </Grid>
        </SoftBox>
    </SoftBox>)
}

export default Billing