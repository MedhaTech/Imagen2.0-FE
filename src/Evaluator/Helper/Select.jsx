const Select = ({ list, setValue, placeHolder, value }) => {
    return (
        <select   className="form-select" onChange={(e) => setValue(e.target.value)} value={value} >
            <option value={''} disabled>{placeHolder}</option>
            {list && list.length > 0 ? (
                list.map((item, i) => (
                    <option key={i} value={item}>
                        {item}
                    </option>
                ))
            ) : (
                <option value={''} disabled>No Data found</option>
            )}
        </select>
    );
};

export default Select;
