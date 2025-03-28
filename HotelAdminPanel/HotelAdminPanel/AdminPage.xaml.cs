﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
    /// Interaction logic for AdminPage.xaml
    /// </summary>
    public partial class AdminPage : Window
    {
        public AdminPage()
        {
            InitializeComponent();
        }

        private void usermg_Click(object sender, RoutedEventArgs e)
        {

            UserManagement userManagement = new UserManagement();
            userManagement.Show();
            Window.GetWindow(this)?.Close();
        }

        private void hotelmg_Click(object sender, RoutedEventArgs e)
        {
            HotelManagement hotelManagement = new HotelManagement();
            hotelManagement.Show();
            Window.GetWindow(this)?.Close();
        }

        private void datamg_Click(object sender, RoutedEventArgs e)
        {
            DataView dataView = new DataView();
            dataView.Show();
            Window.GetWindow(this)?.Close();
        }
    }
}
