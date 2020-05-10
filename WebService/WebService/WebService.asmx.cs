using DrectSoft.Excel;
using Newtonsoft.Json;
using System;
using System.Data;
using System.Web;
using System.Web.Services;

namespace DrectSoft
{
    /// <summary>
    /// Summary description for WebService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    // [System.Web.Script.Services.ScriptService]
    public class WebService : System.Web.Services.WebService
    {
        [WebMethod]
        public bool HttpPostInsert(string Jsons)
        {
            DataTable dt = new DataTable();
            dt = JsonConvert.DeserializeObject<DataTable>(Jsons);
            MySQLiteHelper mySqliteHeloer = new MySQLiteHelper();
            bool mess = true;
            int i = 0;
            if (dt.Rows[0]["xh"] != null && dt.Rows[0]["xh"] != "")
            {
                dt.TableName = "Ifonupdate";
                i = mySqliteHeloer.ExecuteNonQuery("update Ifon set ", dt, "update");
            }

            else
                i = mySqliteHeloer.ExecuteNonQuery("insert into Ifon(xh,", dt, "insert");
            if (i != 0)
                mess = false;
            return mess;
        }

        [WebMethod]
        public string HttpPostImpExcel(string Jsons)
        {
            DataTable dt = new DataTable();
            dt = JsonConvert.DeserializeObject<DataTable>(Jsons);
            MySQLiteHelper mySqliteHeloer = new MySQLiteHelper();
            string mess = "[{\"id\":0,\"mess\":\"共导入" + dt.Rows.Count + "行\"}]";
            int i = 0;


            foreach (DataRow dr in dt.Rows)
            {
                DataTable table = mySqliteHeloer.ExecuteDatatable("select * from Ifon where 1=2", new DataTable());
                DataRow myDataRow = table.NewRow();
                myDataRow[0] = 1;
                for (int j = 0; j < dt.Columns.Count; j++)
                {
                    myDataRow[j + 1] = dr[j].ToString();
                }
                table.Rows.Add(myDataRow);
                i = mySqliteHeloer.ExecuteNonQuery("insert into Ifon(xh,", table, "insert");
                if (i != 0)
                {
                    mess = "[{\"id\":1,\"mess\":\"从以下行开始导入失败：" + JsonConvert.SerializeObject(table) + "\"}]";
                    break;
                }
            }

            return mess;
        }

        [WebMethod]
        public string HttpPostSelect(string Jsons)
        {
            DataTable dt = new DataTable();
            dt = JsonConvert.DeserializeObject<DataTable>(Jsons);
            dt.TableName = "Ifon";
            MySQLiteHelper mySqliteHeloer = new MySQLiteHelper();
            DataTable table = mySqliteHeloer.ExecuteDatatable("select * from Ifon where 1=1", dt);
            if (table == null || table.Rows.Count < 1)
                return "[{\"id\":1,\"mess\":\"未查询到数据！\"}]";
            return JsonConvert.SerializeObject(table);
        }

        [WebMethod]
        public string HttpPostSelectUsers(string Jsons)
        {
            string mess = "";
            DataTable dt = new DataTable();
            dt = JsonConvert.DeserializeObject<DataTable>(Jsons);
            MySQLiteHelper mySqliteHeloer = new MySQLiteHelper();
            DataTable table = new DataTable();
            if (dt.Columns.Count == 2)
            {
                dt.TableName = "Userslogin";
                table = mySqliteHeloer.ExecuteDatatable("select * from Users where 1=1", dt);
                if (table != null && table.Rows.Count > 0)
                    return "[{\"id\":\"0\",\"mess\":\"" + table.Rows[0]["name"].ToString() + "\",\"yhgw\":\"" + table.Rows[0]["yhgw"].ToString() + "\"}]";
                mess = "[{\"id\":1,\"mess\":\"用户名或密码错误！\"}]";
            }

            else
            {
                dt.TableName = "UsersManager";
                table = mySqliteHeloer.ExecuteDatatable("select ID,name,username,yhbm,yhgw from Users where 1=2", dt);
                if (table != null && table.Rows.Count > 0)
                    return JsonConvert.SerializeObject(table);
                mess = "[{\"id\":1,\"mess\":\"未查询到数据！\"}]";
            }
            return mess;
        }

        [WebMethod]
        public string HttpPostDeleteUsers(string Jsons)
        {
            string mess = "[{\"id\":1,\"mess\":\"删除用户失败！\"}]";
            DataTable dt = new DataTable();
            dt = JsonConvert.DeserializeObject<DataTable>(Jsons);
            MySQLiteHelper mySqliteHeloer = new MySQLiteHelper();
            int i = 0;
            i = mySqliteHeloer.ExecuteNonQuery("delete from Users  where username != 'admin' and 1=1 ", dt, "delete");
            if (i == 0)
                mess = "[{\"id\":0,\"mess\":\"删除用户成功！\"}]";
            return mess;
        }

        [WebMethod]
        public string HttpPostDeleteIfon(string Jsons)
        {
            string mess = "[{\"id\":1,\"mess\":\"删除记录失败！\"}]";
            DataTable dt = new DataTable();
            dt = JsonConvert.DeserializeObject<DataTable>(Jsons);
            MySQLiteHelper mySqliteHeloer = new MySQLiteHelper();
            int i = 0;
            i = mySqliteHeloer.ExecuteNonQuery("delete from Ifon  where 1=1 ", dt, "delete");
            if (i == 0)
                mess = "[{\"id\":0,\"mess\":\"删除记录成功！\"}]";
            return mess;
        }

        [WebMethod]
        public string HttpPostInsertUser(string Jsons)
        {
            string mess = "";
            DataTable dt = new DataTable();
            int i = 0;
            dt = JsonConvert.DeserializeObject<DataTable>(Jsons);
            MySQLiteHelper mySqliteHeloer = new MySQLiteHelper();
            if (dt.Rows[0]["ID"] != null && dt.Rows[0]["ID"] != "")
            {
                if (dt.Rows[0]["ID"].ToString() == "-1")
                {
                    dt.TableName = "Usersmodifypass";
                    i = mySqliteHeloer.ExecuteNonQuery("update Users set password='", dt, "update");
                    if (i != 0)
                        mess = "[{\"id\":\"1\",\"mess\":\"修改密码失败！\"}]";
                    mess = "[{\"id\":\"0\",\"mess\":\"密码修改成功！\"}]";

                }
                else
                {
                    dt.TableName = "Usersresetpass";
                    i = mySqliteHeloer.ExecuteNonQuery("update Users set ", dt, "update");
                    if (i != 0)
                        mess = "[{\"id\":\"1\",\"mess\":\"重置密码失败！\"}]";
                    mess = "[{\"id\":\"0\",\"mess\":\"密码重置成功！(新密码为：1)\"}]";
                }

            }
            else
            {
                dt.TableName = "Usersinsert";
                DataTable table = mySqliteHeloer.ExecuteDatatable("select * from Users where username='", dt);
                if (table != null && table.Rows.Count > 0)
                    return "[{\"id\":\"1\",\"mess\":\"用户名已经存在！\"}]";
                i = mySqliteHeloer.ExecuteNonQuery("insert into Users(ID,", dt, "insert");
                if (i != 0)
                    mess = "[{\"id\":\"1\",\"mess\":\"注册失败！\"}]";
                mess = "[{\"id\":\"0\",\"mess\":\"注册成功，欢迎使用！初始密码：1\"}]";
            }
            return mess;
        }

        [WebMethod]
        public string HttpPostexpExcle(string Jsoncap, string Jsons)
        {
            DataTable dt = new DataTable();
            DataTable dtcap = new DataTable();
            dtcap = JsonConvert.DeserializeObject<DataTable>(Jsoncap);
            dt = JsonConvert.DeserializeObject<DataTable>(Jsons);

            string mess = "[{\"id\":\"1\",\"mess\":\"导出失败！\"}]";
            //设置导出文件路径
            string filename = DateTime.Now.ToString("yyyyMMddhhmm") + "失效案例库.xls";
            string path = HttpContext.Current.Server.MapPath("Export\\" + filename);

            ExcelOp excel = new ExcelOp();
            if (excel.ExportToExcel(dtcap, dt, path))
            {
                mess = "[{\"id\":\"0\",\"mess\":\"Export/" + filename + "\"}]";
            }
            return mess;
        }
    }
}
