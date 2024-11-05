// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/line
import { ResponsiveLine } from "@nivo/line";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

// 데이터 형식, [{},{}...] 와 같은 오브젝트 리스트 형태
/*
각 오브젝트에는 이런 내용이 들어감.
{
    "id": "norway",
    "color": "hsl(158, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 201
      },
      {
        "x": "helicopter",
        "y": 129
      },
      {
        "x": "boat",
        "y": 178
      },
      {
        "x": "train",
        "y": 239
      },
      {
        "x": "subway",
        "y": 253
      },
      {
        "x": "bus",
        "y": 232
      },
      {
        "x": "car",
        "y": 245
      },
      {
        "x": "moto",
        "y": 159
      },
      {
        "x": "bicycle",
        "y": 119
      },
      {
        "x": "horse",
        "y": 237
      },
      {
        "x": "skateboard",
        "y": 51
      },
      {
        "x": "others",
        "y": 173
      }
    ]
  }
*/

const MyResponsiveLine = ({ data /* see data tab */ }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: "auto",
      max: "auto",
      stacked: true,
      reverse: false,
    }}
    yFormat=" >-.2f"
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "transportation",
      legendOffset: 36,
      legendPosition: "middle",
      truncateTickAt: 0,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "count",
      legendOffset: -40,
      legendPosition: "middle",
      truncateTickAt: 0,
    }}
    colors={{ scheme: "nivo" }}
    pointSize={10}
    pointColor={{ theme: "background" }}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    pointLabel="data.yFormatted"
    pointLabelYOffset={-12}
    enableTouchCrosshair={true}
    useMesh={true}
    legends={[
      {
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 100,
        translateY: 0,
        itemsSpacing: 0,
        itemDirection: "left-to-right",
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: "circle",
        symbolBorderColor: "rgba(0, 0, 0, .5)",
        effects: [
          {
            on: "hover",
            style: {
              itemBackground: "rgba(0, 0, 0, .03)",
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
);
