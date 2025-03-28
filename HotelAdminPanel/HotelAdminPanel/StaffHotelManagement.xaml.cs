using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace HotelAdminPanel
{
    /// <summary>
    /// Interaction logic for StaffHotelManagement.xaml
    /// </summary>
    public partial class StaffHotelManagement : Window
    {
        private void NumberValidationTextBox(object sender, TextCompositionEventArgs e)
        {
            Regex regex = new Regex("[^0-9]+");
            e.Handled = regex.IsMatch(e.Text);
        }
        private void LoadSearchColumns()
        {
            searchsel.Items.Clear();
            searchsel.Items.Add("name");
            searchsel.Items.Add("city");
            searchsel.Items.Add("description");
            searchsel.SelectedIndex = 0;
        }
       
        public StaffHotelManagement()
        {
            InitializeComponent();
            LoadSearchColumns();
            Database database = new Database();
            database.LoadHotelsToDataGrid(hotelsData);
        }

        private void backbtn_Click(object sender, RoutedEventArgs e)
        {
            hotelsData.ItemsSource = null;
            GC.Collect();
            GC.WaitForPendingFinalizers();
            StaffPage staffPage = new StaffPage();
            staffPage.Show();
            Window.GetWindow(this)?.Close();
        }
        private void searchbtn_Click(object sender, RoutedEventArgs e)
        {
            resetbtn.Visibility = Visibility.Visible;
            string selectedColumn = searchsel.Text;
            string searchText = searchbox.Text;

            if (string.IsNullOrWhiteSpace(selectedColumn) || string.IsNullOrWhiteSpace(searchText))
            {
                MessageBox.Show("Please select a column and enter a search term.", "Invalid Input", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            Database database = new Database();
            hotelsData.ItemsSource = null;
            database.SearchData("hotels", selectedColumn, searchText, hotelsData);
        }

        private void resetbtn_Click(object sender, RoutedEventArgs e)
        {
            Database database = new Database();
            hotelsData.ItemsSource = null;
            searchbox.Text = "";
            database.LoadHotelsToDataGrid(hotelsData);
        }

        private void adv_btn_Click(object sender, RoutedEventArgs e)
        {
            Database database = new Database();
            database.SortHotels(minsortprice, maxsortprice, minsortcap, maxsortcap, minrating, maxrating, hotelsData);
        }
    }
}
