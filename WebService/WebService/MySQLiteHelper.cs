
using System;
using System.Data;
using System.Data.SQLite;
namespace DrectSoft
{
    public class MySQLiteHelper
    {
        private readonly string m_DataSource = AppDomain.CurrentDomain.BaseDirectory + @"database\Mydata.db";
        private string m_ConnectionString;
        private SQLiteConnection _SQLconnect = null;

        /// <summary>
        ///创建连接
        /// </summary>
        /// <returns></returns>
        private string SQLiteConnect()
        {
            try
            {
                if (!System.IO.File.Exists(m_DataSource))
                {
                    SQLiteConnection.CreateFile(m_DataSource);
                }
                SQLiteConnectionStringBuilder connectionStringBuilder = new SQLiteConnectionStringBuilder
                {
                    Version = 3,
                    Pooling = true,
                    FailIfMissing = false,
                    DataSource = m_DataSource
                };
                m_ConnectionString = connectionStringBuilder.ConnectionString;
                SQLiteConnection conn = new SQLiteConnection(m_ConnectionString);
                if (conn != null)
                {
                    _SQLconnect = conn;
                    return "0";
                }

                return "2";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }


        /// <summary>
        ///  在事务中,执行带参的sql语句或存储过程
        ///  适用Insert,Delete,Update
        ///  强调事务中不支持对大数据的操作，如Clob,Blob
        /// </summary>
        /// <auth>Yanqiao.Cai</auth>
        /// <date>2013-01-15</date>
        /// <param name="commandtext"></param>
        /// <param name="par"></param>
        /// <param name="commandtype"></param>
        /// <param name="tran"></param>
        public int ExecuteNonQuery(string commandtext, DataTable dt, string commandtype)
        {
            try
            {
                string sqlvalue = "";
                string sqlcol = commandtext;
                string mess = "0";
                if (_SQLconnect == null)
                    mess = SQLiteConnect();
                if (mess != "0")
                    return 1;
                int result = 0;
                _SQLconnect.Open();//打开联接

                switch (commandtype)
                {
                    case "insert":
                        foreach (DataRow dr in dt.Rows)
                        {
                            sqlvalue += " values(null,";
                            for (int j = 0; j < dt.Columns.Count; j++)
                            {
                                if (j == dt.Columns.Count - 1)
                                {

                                    sqlcol += dt.Columns[j].ColumnName;
                                    sqlvalue += "'" + dr[j] + "'";
                                    break;
                                }
                                if (dt.Columns[j].ColumnName == "xh" || dt.Columns[j].ColumnName == "ID")
                                    continue;
                                sqlcol += dt.Columns[j].ColumnName + ",";
                                sqlvalue += "'" + dr[dt.Columns[j].ColumnName] + "',";
                            }
                            sqlcol += ") ";
                            sqlvalue += ")";
                            sqlcol = sqlcol + sqlvalue;
                            SQLiteCommand cmd = new SQLiteCommand(_SQLconnect);
                            cmd.CommandText = sqlcol;
                            cmd.ExecuteNonQuery();
                        }
                        break;
                    case "delete":
                        foreach (DataRow dr in dt.Rows)
                        {
                            for (int j = 0; j < dt.Columns.Count; j++)
                            {
                                if (j == dt.Columns.Count - 1)
                                {
                                    sqlcol += " and " + dt.Columns[j].ColumnName + "='" + dr[dt.Columns[j].ColumnName] + "'";
                                    break;
                                }
                                sqlcol += " and " + dt.Columns[j].ColumnName + "='" + dr[dt.Columns[j].ColumnName] + "',";
                            }
                            SQLiteCommand cmd = new SQLiteCommand(_SQLconnect);
                            cmd.CommandText = sqlcol;
                            cmd.ExecuteNonQuery();
                        }
                        break;
                    case "update":
                        foreach (DataRow dr in dt.Rows)
                        {
                            if (dt.TableName == "Usersmodifypass")
                            {
                                sqlvalue += dr["password"] + "' where  username='" + dr["username"] + "'";
                            }
                            else
                            {
                                for (int j = 0; j < dt.Columns.Count; j++)
                                {
                                    if (dt.Columns[j].ColumnName == "xh" || dt.Columns[j].ColumnName == "ID")
                                    {
                                        sqlvalue += " where " + dt.Columns[j].ColumnName + "='" + dr[dt.Columns[j].ColumnName] + "'";
                                        continue;

                                    }

                                    if (j == dt.Columns.Count - 1)
                                    {
                                        sqlcol += dt.Columns[j].ColumnName + "='" + dr[dt.Columns[j].ColumnName] + "'";
                                        break;
                                    }
                                    sqlcol += dt.Columns[j].ColumnName + "='" + dr[dt.Columns[j].ColumnName] + "',";
                                }
                            }
                            sqlcol += sqlvalue;
                            SQLiteCommand cmd = new SQLiteCommand(_SQLconnect);
                            cmd.CommandText = sqlcol;
                            cmd.ExecuteNonQuery();
                        }
                        break;
                    default:
                        break;
                }

                return result;
            }
            catch (Exception ce)
            {
                throw ce;
            }
            finally
            {
                _SQLconnect.Close();
            }
        }


        /// <summary>
        ///  在事务中,执行带参的sql语句或存储过程
        ///  适用Insert,Delete,Update
        ///  强调事务中不支持对大数据的操作，如Clob,Blob
        /// </summary>
        /// <auth>Yanqiao.Cai</auth>
        /// <date>2013-01-15</date>
        /// <param name="commandtext"></param>
        /// <param name="par"></param>
        /// <param name="commandtype"></param>
        /// <param name="tran"></param>
        public DataTable ExecuteDatatable(string commandtext, DataTable dt)
        {
            try
            {

                string sqlcol = commandtext;
                string mess = "0";


                if (dt == null)
                    return null;

                if (dt.TableName == "Ifon")
                {
                    for (int j = 0; j < dt.Columns.Count; j++)
                    {
                        if (dt.Columns[j].ColumnName == "fssj")
                        {
                            string[] str = dt.Rows[0][dt.Columns[j].ColumnName].ToString().Split('-');
                            if (str.Length > 1)
                                sqlcol += " and " + dt.Columns[j].ColumnName + ">=" + str[0] + " and " + dt.Columns[j].ColumnName + "<=" + str[1];
                            continue;
                        }
                        sqlcol += " and " + dt.Columns[j].ColumnName + " like '%" + dt.Rows[0][dt.Columns[j].ColumnName] + "%'";
                    }
                }
                else if (dt.TableName == "Usersinsert")
                {
                    sqlcol += dt.Rows[0]["username"] + "'";
                }
                else if (dt.TableName == "Userslogin")
                {

                    for (int i = 0; i < dt.Columns.Count; i++)
                    {
                        if (dt.Columns[i].ColumnName != "name")
                        {
                            sqlcol += " and " + dt.Columns[i].ColumnName + "='" + dt.Rows[0][dt.Columns[i].ColumnName] + "'";
                        }
                    }
                }
                else if (dt.TableName == "UsersManager")
                {
                    sqlcol += " or username like '%" + dt.Rows[0]["name"] + "%' or name like '%" + dt.Rows[0]["name"] + "%'";

                }



                if (_SQLconnect == null)
                    mess = SQLiteConnect();
                if (mess != "0")
                    return null;
                _SQLconnect.Open();//打开联接

                SQLiteCommand cmd = new SQLiteCommand(_SQLconnect);
                cmd.CommandText = sqlcol;

                SQLiteDataReader dataReader = cmd.ExecuteReader();

                ///动态添加表的数据列
                DataTable table = new DataTable();
                for (int i = 0; i < dataReader.FieldCount; i++)
                {
                    DataColumn myDataColumn = new DataColumn();
                    myDataColumn.DataType = dataReader.GetFieldType(i);
                    myDataColumn.ColumnName = dataReader.GetName(i);
                    table.Columns.Add(myDataColumn);
                }
                ///添加表的数据
                while (dataReader.Read())
                {
                    DataRow myDataRow = table.NewRow();
                    for (int i = 0; i < dataReader.FieldCount; i++)
                    {
                        myDataRow[i] = dataReader[i].ToString();
                    }
                    table.Rows.Add(myDataRow);
                    myDataRow = null;
                }
                ///关闭数据读取器
                dataReader.Close();
                return table;
            }
            catch (Exception ce)
            {
                throw ce;
            }
            finally
            {
                _SQLconnect.Close();
            }
        }



        public SQLiteConnection SQLconnect
        {
            get { return _SQLconnect; }
        }
    }
}