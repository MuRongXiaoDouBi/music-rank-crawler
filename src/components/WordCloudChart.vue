<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import * as echarts from "echarts";
// import resize from "./mixins/resize";
import "echarts-wordcloud/dist/echarts-wordcloud";
import "echarts-wordcloud/dist/echarts-wordcloud.min";
@Component
export default class WordCloudChart extends Vue {
  //   mixins: [resize],
  @Prop({
    type: String,
    default: "chart"
  })
  className!: string;
  @Prop({
    type: String,
    default: "chart"
  })
  id!: string;
  @Prop({
    type: String,
    default: "100%"
  })
  width!: string;

  @Prop({
    type: String,
    default: "600px"
  })
  height!: string;

  @Prop({
    type: Array,
    default: []
  })
  data!: [];

  @Prop({
    type: String,
    default: ""
  })
  title!: String;

  chart!: any;

  @Watch("data")
  onDataChange(newVal: []) {
    this.$nextTick(() => {
      this.initChart();
    });
  }
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  }
  initChart() {
    // @ts-ignore
    this.chart = echarts.init(document.getElementById(this.id));
    const option = {
      title: {
        text: this.title,
        x: "center"
      },
      backgroundColor: "#fff",
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
      },
      series: [
        {
          type: "wordCloud",
          //用来调整词之间的距离
          gridSize: 15,
          //用来调整字的大小范围
          // Text size range which the value in data will be mapped to.
          // Default to have minimum 12px and maximum 60px size.
          sizeRange: [14, 60],
          // Text rotation range and step in degree. Text will be rotated randomly in range [-90,                                                                             90] by rotationStep 45
          //用来调整词的旋转方向，，[0,0]--代表着没有角度，也就是词为水平方向，需要设置角度参考注释内容
          // rotationRange: [-45, 0, 45, 90],
          // rotationRange: [ 0,90],
          rotationRange: [0, 0],
          //随机生成字体颜色
          // maskImage: maskImage,
          textStyle: {
            normal: {
              top: '100px',
              color: function() {
                return (
                  "rgb(" +
                  Math.round(Math.random() * 255) +
                  ", " +
                  Math.round(Math.random() * 255) +
                  ", " +
                  Math.round(Math.random() * 255) +
                  ")"
                );
              }
            }
          },
          //位置相关设置
          // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
          // Default to be put in the center and has 75% x 80% size.
          left: "center",
          top: "center",
          right: null,
          bottom: null,
          width: "200%",
          height: "200%",
          //数据
          data: this.data
        }
      ]
    };
    this.chart.setOption(option);
  }

  created() {
    this.$nextTick(() => {
      this.initChart();
    });
  }
}
</script>
<style scoped>
.chartsClass {
  padding-left: 1.2rem;
}
</style>
