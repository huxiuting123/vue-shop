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
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Select,
  Tree,
  Tag,
  Option

} from 'element-ui'

Vue
  .use(Option)
  .use(Select)
  .use(Tree)
  .use(Tag)
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
  .use(Breadcrumb)
  .use(BreadcrumbItem)
  .use(Card)
  .use(Row)
  .use(Col)
  .use(Table)
  .use(TableColumn)
  .use(Switch)
  .use(Tooltip)
  .use(Pagination)
  .use(Dialog)
  .use(Table)

// 在vue原型上挂载一个$messag 这个messag是element-ui上的方法 这样$Message就可以在全局上面使用
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
