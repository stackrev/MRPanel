﻿using Abp.Domain.Entities.Auditing;
using MRPanel.Domain.Enum;
using System;
using System.Collections.Generic;

namespace MRPanel.Domain
{
    public class Page : FullAuditedEntity<Guid>
    {
        public string Title { get; set; }

        public string Summery { get; set; }

        public string Content { get; set; }

        public PageType PageType { get; set; }

        public bool IsMainPage { get; set; }

        public ContentPlace ContentPlace { get; set; }

        public ICollection<Widget> Widgets { get; set; }
    }
}