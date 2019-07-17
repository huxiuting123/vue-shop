import Vue from 'vue'
import {
  Button,
  Input,
  Form,
  FormItem,
  Message,
  header,
  aside,
  main,
  container,
  Menu,
  Submenu,
  MenuItem

} from 'element-ui'

Vue
  .use(Button)
  .use(Input)
  .use(Form)
  .use(header)
  .use(aside)
  .use(FormItem)
  .use(main)
  .use(container)
  .use(Menu)
  .use(Submenu)
  .use(MenuItem)
  // 在vue原型上挂载一个$messag 这个messag是element-ui上的方法 这样$Message就可以在全局上面使用
Vue.prototype.$Message = Message
