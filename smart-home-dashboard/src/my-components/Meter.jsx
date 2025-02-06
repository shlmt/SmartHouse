import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard"

const Meter=({meter})=> {
    return (
        <MiniStatisticsCard
            title={{ text: meter.name }}
            count={meter.value}
            percentage={{ color: "error", text: "" }}
            icon={{ color: "success", component: meter.name }}
        />    
    )
}

export default Meter