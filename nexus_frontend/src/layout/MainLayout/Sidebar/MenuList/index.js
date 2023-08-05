import NavGroup from './NavGroup';
import { useEffect, useState } from 'react';
import { getModulesList } from 'Services/moduleServices';
import { useDispatch, useSelector } from 'react-redux';
import { FAIL, REQUEST, SUCCESS } from 'store/actions';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
    const [dynamicNav, setDynamicNav] = useState([]);
    const dispatch = useDispatch();
    const {  loading,moduleList } = useSelector((state) => state.module);
    useEffect(() => {
        dispatch({ type: REQUEST});
        getModulesList().then(res => {
            if (res && res.data) {
                dispatch({ type: SUCCESS, payload: res.data });
            }
            else{
                dispatch({ type: FAIL});
            }
        })
    }, []);
    
    useEffect(() => {
        const module = moduleList?.map((row) => {
            return {
                title: row.name,
                url: row.index,
                id: row.index,
                image: row.icon,
                type: "item"
            }
        })
        setDynamicNav([{
            id: "utilities",
            title: "Menu",
            type: "group",
            children: module
        }])
    }, [moduleList]);

    const dynamicNavItems = dynamicNav.map((item) => {
        return <NavGroup key={item.id} item={item} />;

    });

    return <>{dynamicNavItems}</>;
};

export default MenuList;
