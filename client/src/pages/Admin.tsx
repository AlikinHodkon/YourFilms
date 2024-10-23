function Admin() {
    return (
        <div className={"flex justify-center mt-[3%]"}>
            <form className={"flex flex-col border-2 border-orange-600 rounded"}>
                <label>Login</label>
                <input className={"border-2"} type={"text"} />
                <label>Password</label>
                <input className={"border-2"} type={"password"}/>
            </form>
        </div>
    );
}

export default Admin;