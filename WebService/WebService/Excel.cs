using DevExpress.XtraGrid;
using DevExpress.XtraGrid.Columns;
using DevExpress.XtraGrid.Views.Grid;
using DevExpress.XtraPrinting;
using System.Data;
using System.Windows.Forms;

namespace DrectSoft.Excel
{
    public class ExcelOp
    {
        /// <summary>
        /// 导出到Excel
        /// </summary>
        /// <param name="gridControl">GridControl</param>
        /// <param name="fileNameTitle">导出到Excel的Sheet文件名称</param>
        public bool ExportToExcel(DataTable dtcap, DataTable dt, string fileNameTitle)
        {
            try
            {
                //创建gridview
                GridView gdv = new GridView();
                CharSpellCode csc = new CharSpellCode();
                //根据databale 循环创建列
                for (int i = 0; i < dtcap.Rows.Count; i++)
                {
                    GridColumn gc = new GridColumn();
                    gc.Caption = dtcap.Rows[i]["name"].ToString();
                    gc.FieldName = csc.GetSpellCode(dtcap.Rows[i]["name"].ToString());
                    gc.Visible = true;
                    gdv.Columns.Add(gc);
                }
                gdv.OptionsView.ShowViewCaption = true;
                gdv.ViewCaption = "失效案例库";
                gdv.Appearance.ViewCaption.Options.UseBackColor = true;
                gdv.Appearance.ViewCaption.BackColor = System.Drawing.Color.Orange;
                gdv.Appearance.ViewCaption.BackColor2 = System.Drawing.Color.Orange;
                gdv.Appearance.ViewCaption.Font = new System.Drawing.Font("宋体", 20F);
                gdv.AppearancePrint.Row.TextOptions.WordWrap = DevExpress.Utils.WordWrap.Wrap;
                gdv.AppearancePrint.Row.TextOptions.HAlignment = DevExpress.Utils.HorzAlignment.Center;
                gdv.OptionsPrint.AutoWidth = false;
                gdv.OptionsView.ColumnAutoWidth = false;




                //创建GridControl 
                GridControl gridControl = new GridControl();
                //绑定内容实例，否则需要在界面显示才会自动实例
                gridControl.BindingContext = new BindingContext();
                gridControl.MainView = gdv;
                gridControl.DataSource = dt;
                //强制初始化
                gridControl.ForceInitialize();
                XlsExportOptions options = new XlsExportOptions();
                options.SheetName = "统计信息";
                options.ShowGridLines = true;
                options.RawDataMode = false;
                options.TextExportMode = DevExpress.XtraPrinting.TextExportMode.Text;
                gridControl.ExportToXls(fileNameTitle, options);
                return true;
            }
            catch
            {
                return false;
            }

        }
    }
}