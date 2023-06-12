/* eslint-disable */
<template>
    <div class="mapTools" id="mapTools">
        <!-- 撒点功能 -->
        <div class="mapToolsBox">
        <a-dropdown v-for="(v,i) in htmlTree" :key="i">
            <p class="ant-dropdown-link title" @click="clear(v.name)">{{v.name}}</p>
            <template #overlay>
            <a-menu v-if="v.children!=null">
                <a-menu-item v-for="(v,i) in v.children" :key="i">
                    <a href="javascript:;" @click="change(v.name)">{{v.name}}</a>
                </a-menu-item>
            </a-menu>
            </template>
        </a-dropdown>
        </div>
        <Pop></Pop>
    </div>
</template>
<script>
import 'reflect-metadata'
import { defineComponent } from 'vue';
// export interface AnyObject {
//   [key: string]: any;
// }

import { reactive,toRefs } from 'vue' ;
import {Dropdown,Menu} from 'ant-design-vue';
import Pop from '@/components/mapTools/components/popMap.vue';
//获取public文件夹
let state = reactive({baseURL:process.env.BASE_URL});


export default defineComponent({
    components: {
        ADropdown:Dropdown,
        AMenu:Menu,
        AMenuItem:Menu.Item,
        Pop
    },

    setup(props,context) {
      const htmlTree = [ // 给变量添加类型注解
        {
          name:'测量',
          children:[
            {
              name:'测距'
            },
            {
              name:'测面'
            }
          ]
        },
        {
          name:'标绘',
          children:[
            {
              name:'标记'
            },
            {
              name:'绘线'
            },
            {
              name:'绘面'
            },
          ]
        },
        {
          name:'清除',
          children:null
        },
      ];

        /**
        * @description: 地图绘制清除
        * @param {*}
        * @return {*} :
        */
        const clear = (type) => {
          if (type === '清除') {
            context.emit('change', type);
          }
        };


      /**
        * @description: 地图工具功能选择
        * @param {*}
        * @return {*} :功能名称
        */
        const change=(type)=>{
            context.emit('change',type)
        }

        return{
            ...toRefs(state),
            htmlTree,
            clear,
            change
        }
    },
})
</script>
<style lang='scss' scope>
    .mapTools{
        .mapToolsBox{
            width: auto;
            height: 34px;
            background: rgba(255,255,255,1);
            position: absolute;
            right: 14px;
            top: 14px;
            .title{
                cursor: pointer;
                width: 60px;
                height: 24px;
                border-right: 1px solid #797878;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0;
                margin-top: 5px;
                float: left;
                color: #797878;
            }
            .title:last-child{
                border-right: none;
            }
        }
    }
</style>
