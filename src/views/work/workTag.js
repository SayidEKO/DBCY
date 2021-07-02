/**
 * 工作台子页面
 */
 import Base from "../base";
 import { withRouter } from "react-router-dom";
 import { List } from "antd-mobile";
 
 import { router2workTagList } from "../../utils/routers";
 
 import { menus } from "../../config";
 
 const Item = List.Item;
 
 class WorkTag extends Base {
   constructor(props) {
     super(props)
     this.state = {}
   }
 
   render() {
     return (
       <div>
         <List>
           {
             menus[this.props.location.state].child.map(item => {
               return (
                 <Item
                   key={item.title}
                   thumb={ require('../../assets/menus/menu.png').default }
                   arrow="horizontal"
                   onClick={() => router2workTagList(this, item)}>
                   {item.title}
                 </Item>
               )
             })
           }
         </List>
       </div>
     )
   }
 }
 
 export default withRouter(WorkTag)