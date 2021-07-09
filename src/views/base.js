import { Component } from "react";

export default class Base extends Component {



  //---------------------------  初始化(initialization)  --------------------------- 
  constructor(props) {
    super()
  }


  // 一般较少用
  // 组件挂载到DOM前调用，且只会被调用一次，在这边调用this.setState不会引起组件重新渲染
  // componentWillMount() {

  // }

  // 组件挂载到DOM后调用，且只会被调用一次
  componentDidMount() {
  }

  // 根据组件的props和state（两者的重传递和重赋值，不管值是否有变化，都可以引起组件重新render） ，返回一个React元素（即UI）
  render() {
    return
  }


  //---------------------------  更新(update)阶段  --------------------------- 
  // 父组件重传props时就会调用这个方法
  // 此方法只调用于props引起的组件更新过程中，响应 Props 变化之后进行更新的唯一方式，参数nextProps是父组件传给当前组件的新props。
  // 但父组件render方法的调用不能保证重传给当前组件的props是有变化的，所以在此方法中根据nextProps和this.props来查明重传的props是否改变，
  // 以及如果改变了要执行啥，比如根据新的props调用this.setState出发当前组件的重新render
  // componentWillReceiveProps(nextProps) {

  // }

  // 一般较少用
  // 此方法在调用render方法前执行，在这边可执行一些组件更新发生前的工作。
  // componentWillUpdate(nextProps, nextState) {

  // }

  // 此方法通过比较nextProps，nextState及当前组件的this.props，this.state，
  // 返回true时当前组件将继续执行更新过程，返回false则当前组件更新停止，
  // 以此可用来减少组件的不必要渲染，优化组件性能。
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextProps.someThings === this.props.someThings) {
  //     return false
  //   }
  // }


  // 此方法在组件更新后被调用，可以操作组件更新的DOM，prevProps和prevState这两个参数指的是组件更新前的props和state
  componentDidUpdate(prevProps, prevState, snapshot) {
    // 如果我们有snapshot值, 我们已经添加了 新的items.
    // 调整滚动以至于这些新的items 不会将旧items推出视图。
    // (这边的snapshot是 getSnapshotBeforeUpdate方法的返回值)
    // if (snapshot !== null) {
    //   const list = this.listRef.current;
    //   list.scrollTop = list.scrollHeight - snapshot;
    // }
  }

  // 此方法在组件被卸载前调用，可以在这里执行一些清理工作，以避免引起内存泄漏。
  componentWillUnmount() {

  }

  //---------------------------  v16新加方法  --------------------------- 
  // 在组件创建时和更新时的render方法之前调用，它应该返回一个对象来更新状态，或者返回null来不更新任何内容。
  // 替代 componentWillMount，componentWillReceiveProps，componentWillUpdate
  static getDerivedStateFromProps(props, state) {
    if (props.location.state === undefined) {
      document.title = '东本储运'
    } 
    //是对象则取title
    else if (props.location.state instanceof Object) {
      document.title = props.location.state.title
    } else {
      document.title = props.location.state
    }

    if (props.value !== state.value) {
      return {
        value: props.value,
      }
    }
    // THIS LINE. TOTALLY UNNECESSARY.
    return null;
  }


  // 被调用于render之后，可以读取但无法使用DOM的时候。
  // 它使您的组件可以在可能更改之前从DOM捕获一些信息（例如滚动位置）。
  // 此生命周期返回的任何值都将作为参数传递给componentDidUpdate（）。
  // getSnapshotBeforeUpdate(prevProps, prevState) {
  // 我们是否要添加新的 items 到列表?
  // 捕捉滚动位置，以便我们可以稍后调整滚动.
  // if (prevProps.list.length < this.props.list.length) {
  //   const list = this.listRef.current;
  //   return list.scrollHeight - list.scrollTop;
  // }
  // return null;
  // }
}

