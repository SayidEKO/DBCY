// 提供波纹点击效果容器组件
import { useLayoutEffect, useRef, useState } from 'react';
import './index.css';

const WaveItem = ({
    id,
    x,
    y,
    off = false,
    style
}) => {
    const [active, setActive] = useState(false);
    useLayoutEffect(()=>{
        setTimeout(()=>setActive(true), 20);
    }, []);

    return (
        <div className={`wave-item${active ? (off?' wave-item-off':' wave-item-active') : ''}`} style={{
            left: x, 
            top: y,
            ...style
        }}></div>
    );
}

const Wave = ({
    /** 是否停用波纹效果 */
    disabled = false,
    hitColor = 'rgba(128,128,128,.5)',
    style = {},
    className,
    children
}) => {
    const waveRef = useRef();
    const [items, setItems] = useState([]);

    const getPointerPos = (e) => {
        const pos = {
            x: e.offsetX,
            y: e.offsetY
        };
        console.log('pos', pos);
        let element = e.target;
        while(element.offsetParent && !element.classList.contains('wave')) {
            pos.x += element.offsetLeft;
            pos.y += element.offsetTop;
            console.log('pos++', pos, element.className);
            element = element.offsetParent;
        }
        console.debug(pos);
        return pos;
    }

    const addItem = item => {
        setItems(items => {
            const newItems = [...items];
            newItems.push(item);
            return newItems;
        })
    }

    const offItem = id => {
        setItems(items => {
            const newItems = [...items];
            const findIndex = newItems.findIndex(i => i.id === id);
            if(findIndex > -1) {
                newItems[findIndex].off = true;
            }
            return newItems;
        });
        setTimeout(()=>{
            removeItem(id);
        }, 200);
    }

    const removeItem = id => {
        setItems(items => {
            const newItems = [...items];
            const findIndex = newItems.findIndex(i => i.id === id);
            if(findIndex > -1) {
                newItems.splice(findIndex, 1);
            }
            return newItems;
        })
    }

    /**
     * 
     * @param {PointerEvent} e 
     */
    const onPointerDown = e => {
        if(disabled) return;
        // console.debug(e);
        addItem({
            id: e.pointerId,
            off: false,
            ...getPointerPos(e.nativeEvent)
        });
    };

    /**
     * 
     * @param {PointerEvent} e 
     */
    const onPointerUp = e => {
        if(disabled) return;
        offItem(e.pointerId);
    };

    return <div className={'wave ' + className} style={style} 
        onPointerDown={onPointerDown} 
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        >
        {children}
        <div ref={waveRef} className="wave-over">
            {items.map((item, index)=> (
                <WaveItem 
                    key={index} 
                    style={{
                        borderColor: hitColor,
                        backgroundColor: hitColor,
                    }}
                    {...item} />
            ))}
        </div>
    </div>
}

export default Wave;