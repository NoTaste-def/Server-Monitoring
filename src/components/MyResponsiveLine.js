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

const MyResponsiveLine = ({ data, title }) => (
  <div style={{ height: "400px", marginBottom: "20px" }}>
    <h3>{title}</h3>
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Time",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Value",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      colors={{ scheme: "nivo" }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          translateX: 100,
          itemWidth: 80,
          itemHeight: 20,
          symbolSize: 12,
        },
      ]}
    />
  </div>
);

export default MyResponsiveLine;
