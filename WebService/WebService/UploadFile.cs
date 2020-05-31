using System;
using System.IO;
using System.Web;

namespace DrectSoft
{
    public class UploadFile
    {
        public string SaveFile(HttpContext httpcontext)
        {
            try
            {
                string mess = "1";
                HttpPostedFile data = httpcontext.Request.Files["data"];
                int total = Convert.ToInt32(httpcontext.Request["total"]);
                int index = Convert.ToInt32(httpcontext.Request["index"]);
                string name = httpcontext.Request["name"];
                string myuuid = httpcontext.Request["uuid"];

                string dir = HttpContext.Current.Server.MapPath("temp\\");
                string path = Path.Combine(dir, myuuid + index);
                data.SaveAs(path);

                if (System.IO.File.Exists(path))
                {
                    mess = (index / total * 100) + "";
                }

                //如果已经是最后一个分片，组合
                //当然你也可以用其它方法比如接收每个分片时直接写到最终文件的相应位置上，但要控制好并发防止文件锁冲突
                if (index == total)
                {

                    string file = HttpContext.Current.Server.MapPath("Upload\\" + myuuid + ".dsp");
                    if (System.IO.File.Exists(file))
                    {
                        System.IO.File.Delete(file);
                    }
                    FileStream fs = new FileStream(file, FileMode.Create);
                    for (int i = 1; i <= total; ++i)
                    {
                        string part = Path.Combine(dir, myuuid + i);
                        byte[] bytes = System.IO.File.ReadAllBytes(part);
                        fs.Write(bytes, 0, bytes.Length);
                        bytes = null;
                        System.IO.File.Delete(part);
                    }
                    fs.Close();
                    if (System.IO.File.Exists(file))
                    {
                        mess = "0";
                    }
                }

                return mess;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string DelFile(string myuuid)
        {
            try
            {
                string mess = "1";
                string file = HttpContext.Current.Server.MapPath("Upload\\" + myuuid + ".dsp");
                if (System.IO.File.Exists(file))
                {
                    System.IO.File.Delete(file);
                    mess = "0";
                }
                return mess;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}