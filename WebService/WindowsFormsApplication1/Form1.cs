using DevExpress.XtraGrid.Columns;
using DevExpress.XtraGrid.Views.Grid;
using DevExpress.XtraPrinting;
using Newtonsoft.Json;
using System;
using System.Data;
using System.Windows.Forms;

namespace WindowsFormsApplication1
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            string ff = "[{\"name\":\"序号\"},{\"name\":\"问题来源\"},{\"name\":\"发生时间\"},{\"name\":\"记录人\"},{\"name\":\"客户名称\"},{\"name\":\"网点\"},{\"name\":\"机组铭牌号\"},{\"name\":\"产品线名称\"},{\"name\":\"产品型号\"},{\"name\":\"发生数量\"},{\"name\":\"问题描述\"},{\"name\":\"失效后果\"},{\"name\":\"严重度\"},{\"name\":\"故障名称\"},{\"name\":\"故障原因\"},{\"name\":\"原因分类\"},{\"name\":\"现场整改方案\"},{\"name\":\"长久改善措施\"},{\"name\":\"涉及零部件\"},{\"name\":\"责任人\"},{\"name\":\"是否闭环\"}]";
            string ss = "[{\"xh\":\"30\",\"wtly\":\"市场反馈\",\"fssj\":\"20191010\",\"jlr\":\"kl\",\"khmc\":\"\",\"wd\":\"\",\"jzmph\":\"\",\"cpxmc\":\"风冷\",\"cpxh\":\"\",\"fssl\":\"0\",\"wtms\":\"\",\"sxhg\":\"\",\"yzcd\":\"1\",\"gzmc\":\"\",\"gzyy\":\"\",\"yyfl\":\"设计不良\",\"xczgfa\":\"\",\"cjgscs\":\"\",\"sjlbj\":\"\",\"zrr\":\"\",\"sfbh\":\"是\"},{\"xh\":\"31\",\"wtly\":\"市场反馈\",\"fssj\":\"20191010\",\"jlr\":\"kl\",\"khmc\":\"dddd\",\"wd\":\"\",\"jzmph\":\"\",\"cpxmc\":\"风冷\",\"cpxh\":\"\",\"fssl\":\"0\",\"wtms\":\"\",\"sxhg\":\"\",\"yzcd\":\"1\",\"gzmc\":\"\",\"gzyy\":\"\",\"yyfl\":\"设计不良\",\"xczgfa\":\"\",\"cjgscs\":\"\",\"sjlbj\":\"\",\"zrr\":\"\",\"sfbh\":\"是\"},{\"xh\":\"32\",\"wtly\":\"市场反馈\",\"fssj\":\"20191010\",\"jlr\":\"kl\",\"khmc\":\"dddd\",\"wd\":\"\",\"jzmph\":\"\",\"cpxmc\":\"风冷\",\"cpxh\":\"\",\"fssl\":\"0\",\"wtms\":\"\",\"sxhg\":\"\",\"yzcd\":\"1\",\"gzmc\":\"\",\"gzyy\":\"\",\"yyfl\":\"设计不良\",\"xczgfa\":\"\",\"cjgscs\":\"\",\"sjlbj\":\"厂商 利好\",\"zrr\":\"\",\"sfbh\":\"是\"},{\"xh\":\"34\",\"wtly\":\"市场反馈\",\"fssj\":\"20191010\",\"jlr\":\"赵强\",\"khmc\":\"\",\"wd\":\"\",\"jzmph\":\"\",\"cpxmc\":\"风冷\",\"cpxh\":\"\",\"fssl\":\"0\",\"wtms\":\"\",\"sxhg\":\"\",\"yzcd\":\"1\",\"gzmc\":\"\",\"gzyy\":\"\",\"yyfl\":\"设计不良\",\"xczgfa\":\"\",\"cjgscs\":\"\",\"sjlbj\":\"\",\"zrr\":\"\",\"sfbh\":\"是\"},{\"xh\":\"35\",\"wtly\":\"市场反馈\",\"fssj\":\"20191010\",\"jlr\":\"kl\",\"khmc\":\"dddd\",\"wd\":\"\",\"jzmph\":\"\",\"cpxmc\":\"风冷\",\"cpxh\":\"\",\"fssl\":\"0\",\"wtms\":\"\",\"sxhg\":\"\",\"yzcd\":\"1\",\"gzmc\":\"\",\"gzyy\":\"\",\"yyfl\":\"设计不良\",\"xczgfa\":\"\",\"cjgscs\":\"\",\"sjlbj\":\"厂商 利好\",\"zrr\":\"\",\"sfbh\":\"是\"}]";
            DataTable dt = new DataTable();
            DataTable dtcap = new DataTable();
            dtcap = JsonConvert.DeserializeObject<DataTable>(ff);
            dt = JsonConvert.DeserializeObject<DataTable>(ss);



            //创建gridview
            GridView gdv = new GridView();
            CharSpellCode csc = new CharSpellCode();
            //根据databale 循环创建列
            for (int i = 0; i < dtcap.Rows.Count; i++)
            {
                GridColumn gc = new GridColumn();
                gc.Caption = dtcap.Rows[i]["name"].ToString();
                gc.FieldName = csc.GetSpellCode(dtcap.Rows[i]["name"].ToString());
                gc.Name = csc.GetSpellCode(dtcap.Rows[i]["name"].ToString());
                gc.Visible = true;
                gc.VisibleIndex = i;
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




            gridControl1.BindingContext = new BindingContext();
            gridControl1.MainView = gdv;
            gridControl1.DataSource = dt;
            gridControl1.ForceInitialize();
            XlsExportOptions options = new XlsExportOptions();
            options.SheetName = "统计信息";
            options.ShowGridLines = true;
            gridControl1.ExportToXls("F:/exp.xls", options);
        }
    }
}
