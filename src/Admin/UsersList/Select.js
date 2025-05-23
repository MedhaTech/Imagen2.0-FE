const Select = ({ list, setValue, placeHolder, value }) => {
    return (
        <select
            onChange={(e) => setValue(e.target.value)}
            value={value}
            // className="border rounded-3 px-4 pointer w-75"
            className="form-select"
            style={{ height: '2.4rem', outline: 'none' }}
        >
            <option value={''} disabled>
                {placeHolder}
            </option>
            {list && list.length > 0 ? (
                list.map((item, i) => (
                    <option key={i} value={item}>
                        {item}
                    </option>
                ))
            ) : (
                <option disabled>No Data found</option>
            )}
        </select>
    );
};

export default Select;
